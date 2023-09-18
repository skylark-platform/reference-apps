import { GraphQLObjectTypes, graphQLClient } from "@skylark-reference-apps/lib";
import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { GraphQLBaseObject } from "../../interfaces";

export const deleteObject = async (
  objectType: GraphQLObjectTypes,
  variables: { uid: string },
) => {
  const mutation = {
    mutation: {
      __variables: {
        uid: "String!",
        // externalId: "String",
      },
      deleteObject: {
        __aliasFor: `delete${objectType}`,
        __args: {
          uid: new VariableType("uid"),
          // external_id: new VariableType("externalId"),
        },
        uid: true,
      },
    },
  };

  const graphQLGetQuery = jsonToGraphQLQuery(mutation);

  await graphQLClient.uncachedRequest<{ getObject: GraphQLBaseObject }>(
    graphQLGetQuery,
    variables,
  );
};
