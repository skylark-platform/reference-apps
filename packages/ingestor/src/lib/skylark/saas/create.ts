import { FieldSet, Records } from "airtable";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { chunk, flatten, has, isString, values } from "lodash";
import { graphQLClient } from "@skylark-reference-apps/lib";

import { GraphQLBaseObject, GraphQLMetadata } from "../../interfaces";
import {
  ApiObjectType,
  MediaObjectTypes,
  GraphQLObjectTypes,
  RelationshipsLink,
  ValidMediaObjectRelationships,
} from "../../types";
import { getValidPropertiesForObject, getExistingObjects } from "./get";
import {
  getExtId,
  gqlObjectMeta,
  getUidsFromField,
  getValidFields,
  createGraphQLOperation,
  getGraphQLObjectAvailability,
} from "./utils";

export const mutateMultipleObjects = async <T>(
  name: string,
  mutations: { [key: string]: object }
): Promise<T[]> => {
  // Smaller requests are better as each is handled by a single lambda
  const chunks = chunk(Object.keys(mutations), 20);

  const chunkedData = await Promise.all(
    chunks.map(async (keys, i): Promise<T[]> => {
      const splitMutations = keys.reduce(
        (previousObj, key) => ({
          ...previousObj,
          [key]: mutations[key],
        }),
        {}
      );

      const mutation = {
        mutation: {
          __name: chunks.length > 1 ? `${name}_chunk_${i + 1}` : name,
          ...splitMutations,
        },
      };

      const graphQLMutation = jsonToGraphQLQuery(mutation);

      const data = await graphQLClient.request<{
        [key: string]: T;
      }>(graphQLMutation);

      const arr = values(data);
      return arr;
    })
  );

  const allData = flatten(chunkedData);

  return allData;
};

export const createOrUpdateGraphQlObjectsUsingIntrospection = async (
  objectType: GraphQLObjectTypes,
  airtableRecords: Records<FieldSet>
): Promise<GraphQLBaseObject[]> => {
  if (airtableRecords.length === 0) {
    return [];
  }

  const validProperties = await getValidPropertiesForObject(objectType);

  const externalIds = airtableRecords.map(({ id }) => id);

  const existingObjects = await getExistingObjects(objectType, externalIds);

  const operations = airtableRecords.reduce(
    (previousOperations, { id, fields }) => {
      const validFields = getValidFields(fields, validProperties);

      const objectExists = existingObjects.includes(id);

      const args = {
        [objectType.toLowerCase()]: objectExists
          ? validFields
          : { ...validFields, external_id: id },
      };
      const { operation, method } = createGraphQLOperation(
        objectType,
        objectExists,
        args,
        { external_id: id }
      );

      const updatedOperations = {
        ...previousOperations,
        [`${method}${id}`]: operation,
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

  const externalIds = airtableRecords.map(({ id }) => id);
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

      const creditExists = existingObjects.includes(id);

      const credit = {
        ...validFields,
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
    "images",
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

    // eslint-disable-next-line no-await-in-loop
    const arr = await mutateMultipleObjects<GraphQLBaseObject>(
      "createMediaObjects",
      operations
    );
    createdMediaObjects.push(...arr);
  }

  return createdMediaObjects;
};
