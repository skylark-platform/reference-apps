import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { has, isNull } from "lodash";
import { graphQLClient } from "@skylark-reference-apps/lib";

import { GraphQLBaseObject, GraphQLIntrospection } from "../../interfaces";
import { GraphQLObjectTypes } from "../../types";

export const getValidPropertiesForObject = async (
  objectType: GraphQLObjectTypes
) => {
  const query = {
    query: {
      __name: "Introspection",
      __type: {
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
    },
  };

  const graphQLGetQuery = jsonToGraphQLQuery(query);

  const data = await graphQLClient.request<GraphQLIntrospection>(
    graphQLGetQuery
  );

  // eslint-disable-next-line no-underscore-dangle
  const types = data.__type.fields
    .filter(
      ({ type: { name, kind } }) =>
        kind !== "OBJECT" || (name && name.startsWith("String"))
    )
    .map(({ name }) => name);

  return types;
};

export const getExistingObjects = async (
  objectType: GraphQLObjectTypes,
  externalIds: string[]
): Promise<string[]> => {
  const getOperations = externalIds.reduce((previousOperations, externalId) => {
    const operation = {
      ...previousOperations,
      [externalId]: {
        __aliasFor: `get${objectType}`,
        __args: {
          ignore_availability: true,
          external_id: externalId,
        },
        uid: true,
        external_id: true,
      },
    };
    return operation;
  }, {} as { [key: string]: object });

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

      const notFoundObjectExternalIds = externalIds.filter((externalId) =>
        Object.keys(data)
          .filter((recordId) => isNull(data[recordId]))
          .includes(externalId)
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
