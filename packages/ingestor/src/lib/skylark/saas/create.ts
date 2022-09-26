import { FieldSet, Records } from "airtable";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { flatten, has, isString, values } from "lodash";
import { GraphQLBaseObject, GraphQLMetadata } from "../../interfaces";
import {
  ApiObjectType,
  MediaObjectTypes,
  GraphQLObjectTypes,
  RelationshipsLink,
  ValidMediaObjectRelationships,
} from "../../types";
import { getValidPropertiesForObject, getExistingObjects } from "./get";
import { graphQLClient } from "./graphql";
import {
  getExtId,
  gqlObjectMeta,
  getUidsFromField,
  getValidFields,
} from "./utils";

const createOrUpdateMultipleObjects = async (
  mutation: string
): Promise<GraphQLBaseObject[]> => {
  const data = await graphQLClient.request<{
    [key: string]: GraphQLBaseObject;
  }>(mutation);

  const arr = values(data);
  return arr;
};

export const createOrUpdateGraphQlObjectsUsingIntrospection = async (
  objectType: GraphQLObjectTypes,
  airtableRecords: Records<FieldSet>
): Promise<GraphQLBaseObject[]> => {
  const validProperties = await getValidPropertiesForObject(objectType);

  const externalIds = airtableRecords.map(({ id }) => id);

  const existingObjects = await getExistingObjects(objectType, externalIds);

  const operations = airtableRecords.reduce(
    (previousOperations, { id, fields }) => {
      const validFields = getValidFields(fields, validProperties);

      const objectExists = existingObjects.includes(id);
      const method = objectExists
        ? `update${objectType}`
        : `create${objectType}`;

      const operation = {
        __aliasFor: method,
        __args: objectExists
          ? {
              external_id: id,
              [objectType.toLowerCase()]: {
                ...validFields,
              },
            }
          : {
              [objectType.toLowerCase()]: {
                ...validFields,
                external_id: id,
              },
            },
        uid: true,
        external_id: true,
      };

      const updatedOperations = {
        ...previousOperations,
        [`${method}${id}`]: operation,
      };
      return updatedOperations;
    },
    {} as { [key: string]: object }
  );

  const mutation = {
    mutation: {
      __name: `createOrUpdate${objectType}s`,
      ...operations,
    },
  };

  const graphQLMutation = jsonToGraphQLQuery(mutation);

  const data = await createOrUpdateMultipleObjects(graphQLMutation);

  return data;
};

export const createOrUpdateGraphQLCredits = async (
  airtableRecords: Records<FieldSet>,
  metadata: GraphQLMetadata
): Promise<GraphQLBaseObject[]> => {
  const validProperties = await getValidPropertiesForObject("Credit");

  const externalIds = airtableRecords.map(({ id }) => id);
  const existingObjects = await getExistingObjects("Credit", externalIds);

  const operations = [airtableRecords[0]].reduce(
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

      const creditExists = existingObjects.includes(id);
      const method = creditExists ? `updateCredit` : `createCredit`;

      const credit = {
        relationships: {
          people: {
            link: person.uid,
          },
          roles: {
            link: role.uid,
          },
        },
        ...validFields,
      };

      const operation = {
        ...previousOperations,
        [`${method}${id}`]: {
          __aliasFor: method,
          __args: creditExists
            ? {
                external_id: id,
                credit,
              }
            : {
                credit: {
                  ...credit,
                  external_id: id,
                },
              },
          uid: true,
          external_id: true,
        },
      };
      return operation;
    },
    {} as { [key: string]: object }
  );

  const mutation = {
    mutation: {
      __name: "createOrUpdateCredits",
      ...operations,
    },
  };

  const graphQLMutation = jsonToGraphQLQuery(mutation);

  const data = await createOrUpdateMultipleObjects(graphQLMutation);

  return data;
};

const getMediaObjectRelationships = (
  fields: FieldSet,
  metadata: GraphQLMetadata
) => {
  const relationshipNames: ValidMediaObjectRelationships[] = [
    "themes",
    "genres",
    "ratings",
    "tags",
    "credits",
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

export const createGraphQLMediaObjects = async (
  airtableRecords: Records<FieldSet>,
  metadata: GraphQLMetadata
) => {
  const validObjectProperties: { [key in MediaObjectTypes]: string[] } = {
    Episode: await getValidPropertiesForObject("Episode"),
    Season: await getValidPropertiesForObject("Season"),
    Brand: await getValidPropertiesForObject("Brand"),
    Movie: await getValidPropertiesForObject("Movie"),
    Asset: await getValidPropertiesForObject("Asset"),
  };

  const externalIds = airtableRecords.map(({ id }) => id);
  const existingObjects = flatten(
    await Promise.all(
      ["Brand", "Season", "Episode", "Movie", "Asset"].map((objectType) =>
        getExistingObjects(objectType as MediaObjectTypes, externalIds)
      )
    )
  );

  const createdMediaObjects: GraphQLBaseObject[] = [];
  while (createdMediaObjects.length < airtableRecords.length) {
    const objectsToCreateUpdate = airtableRecords.filter((record) => {
      // Filter out any records that have already been created
      const alreadyCreated = createdMediaObjects.find(
        ({ external_id }) => record.id === getExtId(external_id)
      );
      if (alreadyCreated) {
        return false;
      }

      // If the record doesn't have a parent, we can create it without dependencies on other objects
      if (!record.fields.parent) {
        return true;
      }

      // If the record has a parent, we need to ensure that its parent object has been created first
      const found = createdMediaObjects.find(({ external_id }) =>
        (record.fields.parent as string[]).includes(getExtId(external_id))
      );
      return found;
    });

    // Stops infinite loop
    if (objectsToCreateUpdate.length === 0) {
      break;
    }

    const operations = objectsToCreateUpdate.reduce(
      (previousOperations, { id, fields }) => {
        if (
          !has(fields, "title") ||
          !has(fields, "slug") ||
          !isString(fields.title) ||
          !isString(fields.slug)
        ) {
          return {};
        }

        const { objectType, argName, createFunc, updateFunc } = gqlObjectMeta(
          fields.skylark_object_type as ApiObjectType
        );

        const objectExists = existingObjects.includes(id);
        const method = objectExists ? updateFunc : createFunc;

        const validFields = getValidFields(
          fields,
          validObjectProperties[objectType]
        );

        const relationships: RelationshipsLink = getMediaObjectRelationships(
          fields,
          metadata
        );

        const parentField = fields.parent as string[];
        if (parentField && parentField.length > 0) {
          const parent = createdMediaObjects.find(
            ({ external_id }) => parentField[0] === getExtId(external_id)
          );

          if (parent) {
            const { relName } = gqlObjectMeta(
              // eslint-disable-next-line no-underscore-dangle
              parent?.__typename as MediaObjectTypes
            );
            relationships[relName] = { link: parent.uid };
          }
        }

        const updatedOperations: { [key: string]: object } = {
          ...previousOperations,
          [`${method}_${id}`]: {
            __aliasFor: method,
            __args: objectExists
              ? {
                  external_id: id,
                  [argName]: {
                    ...validFields,
                    relationships,
                  },
                }
              : {
                  [argName]: {
                    external_id: id,
                    ...validFields,
                    relationships,
                  },
                },
            __typename: true,
            uid: true,
            external_id: true,
            title: true,
            slug: true,
          },
        };
        return updatedOperations;
      },
      {} as { [key: string]: object }
    );

    const mutation = {
      mutation: {
        __name: "createMediaObjects",
        ...operations,
      },
    };

    const graphQLMutation = jsonToGraphQLQuery(mutation);

    // eslint-disable-next-line no-await-in-loop
    const arr = await createOrUpdateMultipleObjects(graphQLMutation);
    createdMediaObjects.push(...arr);
  }

  return createdMediaObjects;
};
