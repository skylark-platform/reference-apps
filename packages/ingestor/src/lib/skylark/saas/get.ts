import { FieldSet } from "airtable";
import { gql } from "graphql-request";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { has, isArray, isNull } from "lodash";
import { GraphQLBaseObject } from "../../interfaces";
import { GraphQLObjectTypes } from "../../types";
import { graphQLClient } from "./graphql";

export const getValidFields = (
  fields: FieldSet,
  validProperties: string[]
): { [key: string]: string | number | boolean } => {
  const validObjectFields = validProperties.filter((property) =>
    has(fields, property)
  );
  const validFields = validObjectFields.reduce((obj, property) => {
    const val = isArray(fields[property])
      ? (fields[property] as string[])[0]
      : fields[property];
    return {
      ...obj,
      [property]: val as string | number | boolean,
    };
  }, {} as { [key: string]: string | number | boolean });

  return validFields;
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

  const graphQLGetQuery = jsonToGraphQLQuery(query, { pretty: true });

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

export const getValidPropertiesForObject = async (
  objectType: GraphQLObjectTypes
) => {
  const query = gql`
query Introspection {
  __type(name: "${objectType}") {
    name
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}
`;
  interface IIntrospectionType {
    __type: {
      name: string;
      fields: {
        name: string;
        type: {
          name: string;
          kind: string;
        };
      }[];
    };
  }

  const data = await graphQLClient.request<IIntrospectionType>(query);

  console.log(data);

  // eslint-disable-next-line no-underscore-dangle
  const types = data.__type.fields
    .filter(
      ({ type: { name, kind } }) =>
        kind !== "OBJECT" || (name && name.startsWith("String"))
    )
    .map(({ name }) => name);

  return types;
};
