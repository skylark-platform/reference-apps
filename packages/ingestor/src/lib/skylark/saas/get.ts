import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { chunk, has, isNull } from "lodash";
import { graphQLClient, GraphQLObjectTypes } from "@skylark-reference-apps/lib";

import {
  GraphQLBaseObject,
  GraphQLIntrospection,
  GraphQLIntrospectionProperties,
  GraphQLObjectRelationshipsType,
} from "../../interfaces";

export const getValidPropertiesForObject = async (
  objectType: GraphQLObjectTypes
): Promise<GraphQLIntrospectionProperties[]> => {
  const query = {
    query: {
      IntrospectionOnType: {
        __aliasFor: "__type",
        __args: {
          name: objectType,
        },
        name: true,
        fields: {
          name: true,
          type: {
            name: true,
            kind: true,
          },
        },
      },
      IntrospectionOnInputType: {
        __aliasFor: "__type",
        __args: {
          name: `${objectType}Input`,
        },
        name: true,
        inputFields: {
          name: true,
          type: {
            name: true,
            kind: true,
          },
        },
      },
    },
  };

  const graphQLGetQuery = jsonToGraphQLQuery(query);

  const data = await graphQLClient.request<GraphQLIntrospection>(
    graphQLGetQuery,
    {},
    { "x-bypass-cache": "1" }
  );

  const supportedKinds = ["SCALAR", "ENUM", "NON_NULL"];
  const supportedObjects = ["availability"];

  const fields =
    data.IntrospectionOnInputType?.inputFields ||
    data.IntrospectionOnType.fields;
  const filteredFields = fields.filter(
    ({ name: property, type: { kind } }) =>
      supportedKinds.includes(kind) || supportedObjects.includes(property)
  );
  const types: GraphQLIntrospectionProperties[] = filteredFields.map(
    ({ name, type: { kind } }) => ({ property: name, kind })
  );

  return types;
};

export const getValidRelationshipsForObject = async (
  objectType: GraphQLObjectTypes
): Promise<string[]> => {
  const query = {
    query: {
      GET_OBJECT_RELATIONSHIPS: {
        __aliasFor: "__type",
        __args: {
          name: `${objectType}Relationships`,
        },
        inputFields: {
          name: true,
          type: {
            name: true,
          },
        },
      },
    },
  };

  const graphQLGetQuery = jsonToGraphQLQuery(query);

  const data = await graphQLClient.request<GraphQLObjectRelationshipsType>(
    graphQLGetQuery,
    {},
    { "x-bypass-cache": "1" }
  );

  const fields =
    data.GET_OBJECT_RELATIONSHIPS?.inputFields.map(({ name }) => name) || [];

  return fields;
};

const getExistingObjectsByExternalId = async (
  objectType: GraphQLObjectTypes,
  objects: { externalId: string; language?: string | null }[],
  language?: string
): Promise<{ existingObjects: string[]; missingObjects: string[] }> => {
  const externalIds = objects.map(({ externalId }) => externalId);
  const getOperations = objects.reduce(
    (previousQueries, { externalId, language: objLanguage }) => {
      const args: { [key: string]: string | boolean } = {
        external_id: externalId,
      };

      if (objLanguage || language) {
        args.language = language || (objLanguage as string);
      }

      // Dimensions don't have availability
      if (
        !objectType.startsWith("Dimension") &&
        !objectType.startsWith("Availability")
      ) {
        args.ignore_availability = true;
      }

      const operation = {
        __aliasFor: `get${objectType}`,
        __args: args,
        __typename: true,
        uid: true,
        slug: true,
        external_id: true,
      };

      const queries = {
        ...previousQueries,
        [externalId]: operation,
      };

      return queries;
    },
    {} as { [key: string]: object }
  );

  const query = {
    query: {
      __name: `get${objectType}s`,
      ...getOperations,
    },
  };

  const graphQLGetQuery = jsonToGraphQLQuery(query);

  try {
    // This request will error if at least one external_id doesn't exist
    await graphQLClient.request<{ [key: string]: GraphQLBaseObject }>(
      graphQLGetQuery,
      {},
      { "x-bypass-cache": "1" }
    );
  } catch (err) {
    if (err && has(err, "response.data")) {
      const {
        response: { data },
      } = err as { response: { data: { [recordId: string]: null | object } } };

      const notFoundObjects = objects.filter(({ externalId }) =>
        Object.keys(data)
          .filter((recordId) => isNull(data[recordId]))
          .includes(externalId)
      );
      const notFoundObjectExternalIds = notFoundObjects.map(
        ({ externalId }) => externalId
      );
      const existingObjects = externalIds.filter(
        (externalId) => !notFoundObjectExternalIds.includes(externalId)
      );
      return {
        existingObjects,
        missingObjects: notFoundObjectExternalIds,
      };
    }

    // If unexpected error, re throw
    throw err;
  }

  return {
    existingObjects: externalIds,
    missingObjects: [],
  };
};

export const getExistingObjects = async (
  objectType: GraphQLObjectTypes,
  objects: { externalId: string; language?: string | null }[],
  language?: string
): Promise<{
  existingObjects: Set<string>;
  missingObjects: Set<string>;
}> => {
  const chunkSize = 100;

  if (objects.length <= chunkSize) {
    const { existingObjects, missingObjects } =
      await getExistingObjectsByExternalId(objectType, objects, language);
    return {
      existingObjects: new Set(existingObjects),
      missingObjects: new Set(missingObjects),
    };
  }

  const chunkedObjects = chunk(objects, chunkSize);
  const chunkedRequests = chunk(chunkedObjects, 10); // Make 10 requests at a time

  const existingObjectsArr: {
    existingObjects: string[];
    missingObjects: string[];
  }[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const requests of chunkedRequests) {
    // eslint-disable-next-line no-await-in-loop
    const responses = await Promise.all(
      requests.map((objs) =>
        getExistingObjectsByExternalId(objectType, objs, language)
      )
    );

    existingObjectsArr.push(...responses);
  }

  const existingObjects = new Set(
    existingObjectsArr.flatMap(({ existingObjects: arr }) => arr)
  );
  const missingObjects = new Set(
    existingObjectsArr.flatMap(({ missingObjects: arr }) => arr)
  );

  return { existingObjects, missingObjects };
};
