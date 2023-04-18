import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { has, isNull } from "lodash";
import { graphQLClient, GraphQLObjectTypes } from "@skylark-reference-apps/lib";

import {
  GraphQLBaseObject,
  GraphQLIntrospection,
  GraphQLIntrospectionProperties,
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
    graphQLGetQuery
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

export const getExistingObjects = async (
  objectType: GraphQLObjectTypes,
  objects: { externalId: string; language?: string | null }[]
): Promise<string[]> => {
  const externalIds = objects.map(({ externalId }) => externalId);
  const getOperations = objects.reduce(
    (previousQueries, { externalId, language }) => {
      const args: { [key: string]: string | boolean } = {
        external_id: externalId,
      };

      if (language) {
        args.language = language;
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
        uid: true,
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
      graphQLGetQuery
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
      const objectsThatExist = externalIds.filter(
        (externalId) => !notFoundObjectExternalIds.includes(externalId)
      );
      return objectsThatExist;
    }

    // If unexpected error, re throw
    throw err;
  }

  return externalIds;
};
