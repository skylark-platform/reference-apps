import { GraphQLClient, Variables, request } from "graphql-request";
import { SAAS_API_ENDPOINT, SAAS_API_KEY } from "./skylark.constants";

export const graphQLClient = new GraphQLClient(SAAS_API_ENDPOINT, {
  headers: {
    Authorization: SAAS_API_KEY,
  },
});

export const skylarkRequest = <T>(
  uri: string,
  apiKey: string,
  query: string,
  variables: Variables,
  headers: object
) =>
  request<T>(uri, query, variables, {
    ...headers,
    Authorization: apiKey,
  });
