import { GraphQLClient, request } from "graphql-request";
import { SAAS_API_ENDPOINT, SAAS_API_KEY } from "./skylark.constants";

export const graphQLClient = new GraphQLClient(SAAS_API_ENDPOINT, {
  headers: {
    "x-api-key": SAAS_API_KEY,
    Authorization: SAAS_API_KEY,
  },
});

export const skylarkRequest = <T>(
  uri: string,
  apiKey: string,
  query: string,
  variables: object,
  headers: object
) =>
  request<T>(uri, query, variables, {
    ...headers,
    "x-api-key": apiKey,
    Authorization: apiKey,
  });
