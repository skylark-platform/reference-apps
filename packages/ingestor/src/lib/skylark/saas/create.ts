import {
  GraphQLMediaObjectTypes,
  GraphQLObjectTypes,
  graphQLClient,
} from "@skylark-reference-apps/lib";
import { Attachment, FieldSet, Records } from "airtable";
import { EnumType, jsonToGraphQLQuery } from "json-to-graphql-query";
import { chunk, flatten, has, isArray, isEmpty, isString } from "lodash";
import {
  CREATE_OBJECT_CHUNK_SIZE,
  CONCURRENT_CREATE_REQUESTS_NUM,
} from "../../constants";

import {
  CreateOrUpdateRelationships,
  GraphQLBaseObject,
  GraphQLIntrospectionProperties,
  GraphQLMetadata,
  SkylarkGraphQLError,
} from "../../interfaces";
import { RelationshipsLink, ValidMediaObjectRelationships } from "../../types";
import {
  getValidPropertiesForObject,
  getExistingObjects,
  getValidRelationshipsForObject,
  getExistingObjectByExternalId,
} from "./get";
import {
  getExtId,
  gqlObjectMeta,
  getUidsFromField,
  getValidFields,
  createGraphQLOperation,
  getGraphQLObjectAvailability,
  getLanguageCodesFromAirtable,
  hasProperty,
  pause,
} from "./utils";
import { deleteObject } from "./delete";

const isKnownError = (errMessage: string) =>
  errMessage.startsWith("Unable to find version None for language") ||
  (errMessage.startsWith("External ID ") &&
    errMessage.endsWith(" already exists"));

const graphqlMutationWithRetry = async <T>(
  mutation: string,
  variables: object,
  { retries = 3, everySeconds = 5 },
  retriesCount = 0
): Promise<T> => {
  try {
    return await graphQLClient.request<T>(mutation, variables, {
      "x-bypass-cache": "1",
    });
  } catch (err) {
    // Some errors we know won't be fixed on a retry, so we rethrow
    if (err && has(err, "response.errors")) {
      const {
        response: { errors },
      } = err as SkylarkGraphQLError;

      const errMessage = errors?.[0]?.message;
      if (errMessage && isKnownError(errMessage)) {
        // eslint-disable-next-line no-console
        console.error(
          `[graphqlMutationWithRetry] known error hit: ${errMessage}`
        );
        throw err;
      }
    }

    const updatedCount = retriesCount + 1;
    if (updatedCount > retries) {
      throw err;
    }

    const pauseTimeSeconds = everySeconds * updatedCount;
    // eslint-disable-next-line no-console
    console.error(
      `[graphqlMutationWithRetry] Error hit. Retrying after ${pauseTimeSeconds} seconds (${updatedCount}/${retries})`
    );
    // Wait longer each retry
    await pause(pauseTimeSeconds * 1000);
    return graphqlMutationWithRetry<T>(
      mutation,
      variables,
      { retries, everySeconds },
      updatedCount
    );
  }
};

export const mutateMultipleObjects = async <T extends { external_id?: string }>(
  name: string,
  mutations: { [key: string]: object }
): Promise<T[]> => {
  // Smaller requests are better as each is handled by a single lambda
  const chunks = chunk(Object.keys(mutations), CREATE_OBJECT_CHUNK_SIZE);

  // Limit the number of requests to Skylark we make at once
  const concurrentRequestChunks = chunk(chunks, CONCURRENT_CREATE_REQUESTS_NUM);

  const allData: T[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const requestChunksBatch of concurrentRequestChunks) {
    // eslint-disable-next-line no-await-in-loop
    const chunkedData = await Promise.all(
      requestChunksBatch.map(async (keys, i): Promise<T[]> => {
        const splitMutations = keys.reduce(
          (previousObj, key) => ({
            ...previousObj,
            [key]: mutations[key],
          }),
          {}
        );

        const mutation = {
          mutation: {
            __name:
              requestChunksBatch.length > 1 ? `${name}_chunk_${i + 1}` : name,
            ...splitMutations,
          },
        };

        const graphQLMutation = jsonToGraphQLQuery(mutation);

        try {
          const data = await graphqlMutationWithRetry<{
            [key: string]: T;
          }>(graphQLMutation, {}, { retries: 10 });

          if (!data) {
            return [];
          }

          const arr = Object.entries(data).map(([requestId, requestData]) => {
            // There is a bug at the moment where the external_id may not be returned. This attempts to get it out of the requestId
            const requestDataExternalId = requestData.external_id || false;
            const airtableRecordPrefix = "rec";
            const recordIdInRequestId =
              requestId.indexOf(airtableRecordPrefix) > 0;
            const externalIdFromRequestId =
              recordIdInRequestId &&
              `rec${requestId.substring(
                requestId.indexOf(airtableRecordPrefix) + 1
              )}`;

            return {
              ...requestData,
              external_id:
                requestDataExternalId || externalIdFromRequestId || null,
            };
          });
          return arr;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Failing request: ", graphQLMutation);
          throw err;
        }
      })
    );

    const flattenedBatchData = flatten(chunkedData);
    allData.push(...flattenedBatchData);
  }

  return allData;
};

export const createOrUpdateGraphQlObjectsUsingIntrospection = async (
  objectType: GraphQLObjectTypes,
  existingObjects: Set<string>,
  objects: ((
    | FieldSet
    | Record<string, string | null | string[] | boolean | number | object>
  ) & { _id: string; language?: string })[],
  {
    metadataAvailability,
    isImage,
    language,
    relationships,
    availabilityUids,
  }: {
    metadataAvailability?: GraphQLMetadata["availability"];
    isImage?: boolean;
    language?: string;
    relationships?: CreateOrUpdateRelationships;
    availabilityUids?: string[];
  }
): Promise<{
  createdObjects: GraphQLBaseObject[];
  deletedObjects: GraphQLBaseObject[];
}> => {
  if (objects.length === 0) {
    return { createdObjects: [], deletedObjects: [] };
  }

  const validProperties = await getValidPropertiesForObject(objectType);

  const validRelationships: string[] = [];
  if (relationships) {
    const validRels = await getValidRelationshipsForObject(objectType);
    validRelationships.push(...validRels);
  }

  const operations = objects.reduce(
    (previousOperations, { _id: id, ...fields }) => {
      const validFields = getValidFields(fields, validProperties);

      const objectExists = existingObjects.has(id);

      const availability = metadataAvailability
        ? getGraphQLObjectAvailability(
            metadataAvailability,
            fields.availability as string[]
          )
        : { link: [] };

      if (availabilityUids) {
        availability.link.push(...availabilityUids);
      }

      const argName = objectType
        .match(/[A-Z][a-z]+/g)
        ?.join("_")
        .toLowerCase() as string;

      const objectFields: Record<string, string | object> = {
        ...validFields,
        availability,
      };

      if (isImage) {
        const imageAttachments = fields.image as Attachment[];
        if (imageAttachments.length > 0) {
          const image = imageAttachments[0];
          // https://docs.skylarkplatform.com/docs/creating-an-image#upload-an-image-from-an-external-url
          objectFields.download_from_url = image.url;
          objectFields.content_type = image.type;
        }
      }

      if (relationships && hasProperty(relationships, id)) {
        const relsForObject: Record<
          string,
          {
            link: string[];
          }
        > = relationships[id];

        const relationshipNames = Object.keys(relsForObject);

        const allRelationshipsValid = relationshipNames.every((rel) =>
          validRelationships.includes(rel)
        );
        if (!allRelationshipsValid) {
          throw new Error(
            `[createOrUpdateGraphQlObjectsUsingIntrospection] Invalid relationship given for ${id}: ${relationshipNames.join(
              ", "
            )}`
          );
        }

        objectFields.relationships = relsForObject;
      }

      const args: Record<string, string | number | boolean | object> = {
        [argName]: objectExists
          ? objectFields
          : { ...objectFields, external_id: id },
      };

      if (language) {
        args.language = language;
      }

      const { operation, method } = createGraphQLOperation(
        objectType,
        objectExists,
        args,
        { external_id: id }
      );

      // The order matters as the error handling uses _ to split the method and external ID
      const key = `${method}_${id}`;

      const updatedOperations = {
        ...previousOperations,
        [key]: {
          ...operation,
        },
      };
      return updatedOperations;
    },
    {} as { [key: string]: object }
  );

  try {
    const data = await mutateMultipleObjects<GraphQLBaseObject>(
      `createOrUpdate${objectType}s`,
      operations
    );

    return { createdObjects: data, deletedObjects: [] };
  } catch (err) {
    // If we catch a known error, attempt to fix it before throwing it again
    if (err && has(err, "response.errors")) {
      const {
        response: { errors },
      } = err as SkylarkGraphQLError;

      const alreadyExistsErrors = errors.filter(
        ({ message, path }) =>
          message.startsWith("External ID ") &&
          message.endsWith(" already exists") &&
          path.length === 1
      );

      const unableToFindVersionNoneErrors = errors.filter(
        ({ message, path }) =>
          message.startsWith("Unable to find version None for language") &&
          path.length === 1
      );

      const hasKnownErrors =
        alreadyExistsErrors.length > 0 ||
        unableToFindVersionNoneErrors.length > 0;

      const deletedObjects: GraphQLBaseObject[] = [];

      if (hasKnownErrors) {
        // eslint-disable-next-line no-console
        console.error(
          "[createOrUpdateGraphQlObjectsUsingIntrospection]: known error hit"
        );
        // eslint-disable-next-line no-console
        console.error(err);
        // TODO delete this when the "Unable to find version None" bug is fixed
        if (unableToFindVersionNoneErrors.length > 0) {
          const unableToFindVersionNoneDeletedObjects = (
            await Promise.all(
              unableToFindVersionNoneErrors.map(async (error) => {
                const operationId = error.path[0];
                const splitOperationId = operationId.split(`${objectType}_`);
                const externalId = splitOperationId?.[1];
                if (!externalId) {
                  throw err;
                }
                const existingObject = await getExistingObjectByExternalId(
                  objectType,
                  externalId,
                  language
                );

                if (existingObject) {
                  try {
                    // Don't send language, delete whole object
                    await deleteObject(objectType, { uid: existingObject.uid });
                    // eslint-disable-next-line no-console
                    console.log(
                      `[createOrUpdateGraphQlObjectsUsingIntrospection] Deleted object "${existingObject.external_id}" with "Unable to find version None" error`
                    );
                    return existingObject;
                  } catch (deleteErr) {
                    // If delete fails, just rethrow the previous error
                    throw err;
                  }
                }
                return null;
              })
            )
          ).filter((extId): extId is GraphQLBaseObject => !!extId);

          // As we've deleted the object, it needs to be removed from existingObjects
          unableToFindVersionNoneDeletedObjects.forEach(({ external_id }) =>
            existingObjects.delete(external_id)
          );

          deletedObjects.push(...unableToFindVersionNoneDeletedObjects);
        }

        if (alreadyExistsErrors.length > 0) {
          // If we get already exists error, add any missing objects
          alreadyExistsErrors.forEach((error) => {
            const operationId = error.path[0];
            const splitOperationId = operationId.split(`${objectType}_`);
            const externalId = splitOperationId?.[1];
            if (!externalId) {
              throw err;
            }

            existingObjects.add(externalId);
          });
        }

        const retriedData =
          await createOrUpdateGraphQlObjectsUsingIntrospection(
            objectType,
            existingObjects,
            objects,
            {
              metadataAvailability,
              isImage,
              language,
              relationships,
              availabilityUids,
            }
          );

        return {
          createdObjects: retriedData.createdObjects,
          deletedObjects: [...retriedData.deletedObjects, ...deletedObjects],
        };
      }
    }

    throw err;
  }
};

export const createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection =
  async (
    objectType: GraphQLObjectTypes,
    airtableRecords: Records<FieldSet>,
    metadataAvailability: GraphQLMetadata["availability"],
    isImage?: boolean
  ) => {
    const objects = airtableRecords.map(({ id, fields }) => ({
      ...fields,
      _id: id,
    }));

    const externalIds = objects.map(({ _id }) => ({ externalId: _id }));

    const { existingObjects } = await getExistingObjects(
      objectType,
      externalIds
    );

    const { createdObjects } =
      await createOrUpdateGraphQlObjectsUsingIntrospection(
        objectType,
        existingObjects,
        objects,
        { metadataAvailability, isImage }
      );

    return createdObjects;
  };

export const createOrUpdateGraphQLCredits = async (
  airtableRecords: Records<FieldSet>,
  metadata: GraphQLMetadata
): Promise<GraphQLBaseObject[]> => {
  const validProperties = await getValidPropertiesForObject("Credit");

  const externalIds = airtableRecords.map(({ id }) => ({ externalId: id }));
  const { existingObjects } = await getExistingObjects("Credit", externalIds);

  const operations = airtableRecords.reduce(
    (previousOperations, { id, fields }) => {
      const validFields = getValidFields(fields, validProperties);

      const { person: personField, role: roleField } = fields as {
        person: string[];
        role: string[];
      };

      const availability = getGraphQLObjectAvailability(
        metadata.availability,
        fields.availability as string[]
      );

      const creditExists = existingObjects.has(id);

      const credit: Record<
        string,
        string | number | boolean | EnumType | object
      > = {
        ...validFields,
        availability,
      };

      const relationships: Record<string, { link: string }> = {};

      if (personField && personField.length > 0) {
        const person = metadata.people.find(
          ({ external_id }) => getExtId(external_id) === personField[0]
        );

        if (person?.uid) {
          relationships.people = {
            link: person.uid,
          };
        }
      }

      if (roleField && roleField.length > 0) {
        const role = metadata.roles.find(
          ({ external_id }) => getExtId(external_id) === roleField[0]
        );

        if (role?.uid) {
          relationships.roles = {
            link: role.uid,
          };
        }
      }

      if (Object.keys(relationships).length > 0) {
        credit.relationships = relationships;
      }

      const args = {
        credit: creditExists ? credit : { ...credit, external_id: id },
      };
      const { operation, method } = createGraphQLOperation(
        "Credit",
        creditExists,
        args,
        { external_id: id }
      );

      return {
        ...previousOperations,
        [`${method}${id}`]: operation,
      };
    },
    {} as { [key: string]: object }
  );

  const data = await mutateMultipleObjects<GraphQLBaseObject>(
    "createOrUpdateCredits",
    operations
  );

  return data;
};

export const getMediaObjectRelationships = (
  fields: FieldSet,
  metadata: GraphQLMetadata
) => {
  const relationshipNames: ValidMediaObjectRelationships[] = [
    "themes",
    "genres",
    "ratings",
    "tags",
    "credits",
    "images",
    "call_to_actions",
  ];

  const relationships = relationshipNames.reduce(
    (previousRelationships, name) => {
      const uids = getUidsFromField(fields[name] as string[], metadata[name]);

      if (!uids || uids.length <= 0) {
        return previousRelationships;
      }

      return {
        ...previousRelationships,
        [name]: {
          link: uids,
        },
      };
    },
    {}
  );

  return relationships;
};

// Media table only supports a single language
const getMediaObjectLanguage = (
  fields: FieldSet,
  languagesTable: Records<FieldSet>
): string | null => {
  const languageCodes = getLanguageCodesFromAirtable(languagesTable);
  const languages = hasProperty(fields, "language")
    ? (fields.language as string[])
    : null;
  const language: string | null =
    languages &&
    languages.length > 0 &&
    hasProperty(languageCodes, languages[0])
      ? languageCodes[languages[0]]
      : null;

  return language;
};

export const createGraphQLMediaObjects = async (
  airtableRecords: Records<FieldSet>,
  metadata: GraphQLMetadata,
  languagesTable: Records<FieldSet>
) => {
  const validObjectProperties: {
    [key in GraphQLMediaObjectTypes]: GraphQLIntrospectionProperties[];
  } = {
    Episode: await getValidPropertiesForObject("Episode"),
    Season: await getValidPropertiesForObject("Season"),
    Brand: await getValidPropertiesForObject("Brand"),
    Movie: await getValidPropertiesForObject("Movie"),
    SkylarkAsset: await getValidPropertiesForObject("SkylarkAsset"),
  };

  const externalIdsAndLanguage = airtableRecords.map(({ id, fields }) => ({
    externalId: id,
    language: getMediaObjectLanguage(fields, languagesTable),
  }));

  const existingObjectSets = await Promise.all(
    ["Brand", "Season", "Episode", "Movie", "SkylarkAsset"].map((objectType) =>
      getExistingObjects(
        objectType as GraphQLMediaObjectTypes,
        externalIdsAndLanguage
      )
    )
  );

  const existingObjects = existingObjectSets.reduce(
    (previous, { existingObjects: set }) =>
      new Set<string>([...previous, ...set]),
    new Set<string>([])
  );

  const createdMediaObjects: GraphQLBaseObject[] = [];
  while (createdMediaObjects.length < airtableRecords.length) {
    const objectsToCreateUpdate = airtableRecords.filter((record) => {
      // Filter out any records that have already been created
      const alreadyCreated = createdMediaObjects.find(
        (existingObj) => record.id === getExtId(existingObj.external_id)
      );
      if (alreadyCreated) {
        return false;
      }

      // If the record doesn't have a parent, we can create it without dependencies on other objects
      if (!record.fields.parent) {
        return true;
      }

      // If the record has a parent, we need to ensure that its parent object has been created first
      const found = createdMediaObjects.find((existingObj) => {
        const extId = getExtId(existingObj.external_id);
        return extId && (record.fields.parent as string[]).includes(extId);
      });
      return found;
    });

    // Stops infinite loop
    if (objectsToCreateUpdate.length === 0) {
      break;
    }

    const operations = objectsToCreateUpdate.reduce(
      (previousOperations, { id, fields }) => {
        if (!has(fields, "title") || !isString(fields.title)) {
          return previousOperations;
        }

        const { objectType, argName, createFunc, updateFunc } = gqlObjectMeta(
          fields.skylark_object_type as string
        );

        const objectExists = existingObjects.has(id);
        const method = objectExists ? updateFunc : createFunc;

        if (!hasProperty(validObjectProperties, objectType)) {
          throw new Error(
            `Object Type ${objectType} is not a valid property. Valid ones are ${Object.keys(
              validObjectProperties
            ).join(", ")}`
          );
        }

        const validProperties = validObjectProperties[
          objectType
        ] as GraphQLIntrospectionProperties[];
        const validFields = getValidFields(fields, validProperties);

        const relationships: RelationshipsLink = getMediaObjectRelationships(
          fields,
          metadata
        );

        const availability = getGraphQLObjectAvailability(
          metadata.availability,
          fields.availability as string[]
        );

        const parentField = fields.parent as string[];
        if (parentField && parentField.length > 0) {
          const parent = createdMediaObjects.find(
            ({ external_id }) => parentField[0] === getExtId(external_id)
          );

          if (parent) {
            const { relName } = gqlObjectMeta(
              // eslint-disable-next-line no-underscore-dangle
              parent?.__typename as GraphQLMediaObjectTypes
            );
            relationships[relName] = { link: parent.uid };
          }
        }

        const args = objectExists
          ? {
              external_id: id,
              [argName]: {
                ...validFields,
                relationships,
                availability,
              },
            }
          : {
              [argName]: {
                external_id: id,
                ...validFields,
                relationships,
                availability,
              },
            };

        const language = getMediaObjectLanguage(fields, languagesTable);
        if (language) {
          args.language = language;
        }

        const updatedOperations: { [key: string]: object } = {
          ...previousOperations,
          [`${method}_${id}`]: {
            __aliasFor: method,
            __args: args,
            __typename: true,
            uid: true,
            slug: true,
            external_id: true,
          },
        };
        return updatedOperations;
      },
      {} as { [key: string]: object }
    );

    // Stops infinite loop when blank rows are included
    if (Object.keys(operations).length === 0) {
      break;
    }

    // eslint-disable-next-line no-await-in-loop
    const arr = await mutateMultipleObjects<GraphQLBaseObject>(
      "createMediaObjects",
      operations
    );
    createdMediaObjects.push(...arr);
  }

  return createdMediaObjects;
};

export const createTranslationsForGraphQLObjects = async (
  originalObjects: GraphQLBaseObject[],
  translationsTable: Records<FieldSet>,
  languagesTable: Records<FieldSet>
) => {
  const validObjectProperties: Record<
    string,
    GraphQLIntrospectionProperties[]
  > = {
    Episode: await getValidPropertiesForObject("Episode"),
    Season: await getValidPropertiesForObject("Season"),
    Brand: await getValidPropertiesForObject("Brand"),
    Movie: await getValidPropertiesForObject("Movie"),
    SkylarkAsset: await getValidPropertiesForObject("SkylarkAsset"),
    CallToAction: await getValidPropertiesForObject("CallToAction"),
  };

  const languageCodes = getLanguageCodesFromAirtable(languagesTable);

  const translationOperations = translationsTable.reduce(
    (previousOperations, { fields, id }) => {
      if (
        !fields.object ||
        !isArray(fields.object) ||
        !isArray(fields.languages) ||
        isEmpty(fields.languages)
      ) {
        return previousOperations;
      }

      const [objectAirtableId] = fields.object as string[];
      const originalObject = originalObjects.find(
        ({ external_id }) => external_id === objectAirtableId
      );

      // if the original object doesn't exist
      if (!originalObject) {
        return previousOperations;
      }

      const { objectType, argName, updateFunc } = gqlObjectMeta(
        // eslint-disable-next-line no-underscore-dangle
        originalObject.__typename as GraphQLMediaObjectTypes
      );

      const validFields = getValidFields(
        fields,
        validObjectProperties[objectType]
      );

      const languages = fields.languages as string[];
      const objectsTranslations = languages.reduce(
        (previousTranslations, languageAirtableId) => {
          const language = languageCodes[languageAirtableId];
          const updatedTranslations = {
            ...previousTranslations,
            [`translation_${language.replace("-", "_")}_${id}`]: {
              __aliasFor: updateFunc,
              __args: {
                uid: originalObject.uid,
                language,
                [argName]: validFields,
              },
              __typename: true,
              uid: true,
              slug: true,
              external_id: true,
            },
          };

          return updatedTranslations;
        },
        {} as { [key: string]: object }
      );

      const updatedOperations: { [key: string]: object } = {
        ...previousOperations,
        ...objectsTranslations,
      };

      return updatedOperations;
    },
    {} as { [key: string]: object }
  );

  const arr = await mutateMultipleObjects<GraphQLBaseObject>(
    "createMediaObjectTranslations",
    translationOperations
  );

  return arr;
};
