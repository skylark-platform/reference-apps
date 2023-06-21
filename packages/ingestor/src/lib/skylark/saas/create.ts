import {
  GraphQLMediaObjectTypes,
  GraphQLObjectTypes,
  graphQLClient,
} from "@skylark-reference-apps/lib";
import { Attachment, FieldSet, Records } from "airtable";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { chunk, flatten, has, isArray, isEmpty, isString } from "lodash";
import {
  CREATE_OBJECT_CHUNK_SIZE,
  CONCURRENT_CREATE_REQUESTS_NUM,
} from "../../constants";

import {
  GraphQLBaseObject,
  GraphQLIntrospectionProperties,
  GraphQLMetadata,
} from "../../interfaces";
import { RelationshipsLink, ValidMediaObjectRelationships } from "../../types";
import { getValidPropertiesForObject, getExistingObjects } from "./get";
import {
  getExtId,
  gqlObjectMeta,
  getUidsFromField,
  getValidFields,
  createGraphQLOperation,
  getGraphQLObjectAvailability,
  getLanguageCodesFromAirtable,
  hasProperty,
} from "./utils";

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
          const data = await graphQLClient.request<{
            [key: string]: T;
          }>(graphQLMutation, {}, { "x-bypass-cache": "1" });

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
  airtableRecords: Records<FieldSet>,
  metadataAvailability: GraphQLMetadata["availability"],
  isImage?: boolean
): Promise<GraphQLBaseObject[]> => {
  if (airtableRecords.length === 0) {
    return [];
  }

  const validProperties = await getValidPropertiesForObject(objectType);

  const externalIds = airtableRecords.map(({ id }) => ({ externalId: id }));

  const existingObjects = await getExistingObjects(objectType, externalIds);

  const operations = airtableRecords.reduce(
    (previousOperations, { id, fields }) => {
      const validFields = getValidFields(fields, validProperties);

      const objectExists = existingObjects.includes(id);

      const availability = getGraphQLObjectAvailability(
        metadataAvailability,
        fields.availability as string[]
      );

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

      const args = {
        [argName]: objectExists
          ? objectFields
          : { ...objectFields, external_id: id },
      };

      const { operation, method } = createGraphQLOperation(
        objectType,
        objectExists,
        args,
        { external_id: id }
      );

      const updatedOperations = {
        ...previousOperations,
        [`${method}${id}`]: {
          ...operation,
        },
      };
      return updatedOperations;
    },
    {} as { [key: string]: object }
  );

  const data = await mutateMultipleObjects<GraphQLBaseObject>(
    `createOrUpdate${objectType}s`,
    operations
  );

  return data;
};

export const createOrUpdateGraphQLCredits = async (
  airtableRecords: Records<FieldSet>,
  metadata: GraphQLMetadata
): Promise<GraphQLBaseObject[]> => {
  const validProperties = await getValidPropertiesForObject("Credit");

  const externalIds = airtableRecords.map(({ id }) => ({ externalId: id }));
  const existingObjects = await getExistingObjects("Credit", externalIds);

  const operations = airtableRecords.reduce(
    (previousOperations, { id, fields }) => {
      const validFields = getValidFields(fields, validProperties);

      const {
        person: [personField],
        role: [roleField],
      } = fields as { person: string[]; role: string[] };
      const person = metadata.people.find(
        ({ external_id }) => getExtId(external_id) === personField
      );
      const role = metadata.roles.find(
        ({ external_id }) => getExtId(external_id) === roleField
      );

      if (!person || !role) {
        return previousOperations;
      }

      const availability = getGraphQLObjectAvailability(
        metadata.availability,
        fields.availability as string[]
      );

      const creditExists = existingObjects.includes(id);

      const credit = {
        ...validFields,
        availability,
        relationships: {
          people: {
            link: person.uid,
          },
          roles: {
            link: role.uid,
          },
        },
      };

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
  const existingObjects = flatten(
    await Promise.all(
      ["Brand", "Season", "Episode", "Movie", "SkylarkAsset"].map(
        (objectType) =>
          getExistingObjects(
            objectType as GraphQLMediaObjectTypes,
            externalIdsAndLanguage
          )
      )
    )
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

        const objectExists = existingObjects.includes(id);
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
