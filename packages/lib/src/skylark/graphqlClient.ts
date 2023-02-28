import { GraphQLClient, request } from "graphql-request";
import { Dimensions } from "../interfaces";
import {
  LOCAL_STORAGE,
  SAAS_API_ENDPOINT,
  SAAS_API_KEY,
} from "./skylark.constants";

export const graphQLClient = new GraphQLClient(SAAS_API_ENDPOINT, {
  headers: {
    "x-api-key": SAAS_API_KEY,
  },
});

export const skylarkRequest = <T>(
  uri: string,
  apiKey: string,
  query: string,
  variables?: object,
  headers?: object
) =>
  request<T>(uri, query, variables, {
    ...headers,
    "x-api-key": apiKey,
  });

export const skylarkRequestWithDimensions = <T>(
  query: string,
  dimensions: Dimensions
) => {
  const headers: { [key: string]: string } = {};

  if (dimensions.timeTravel) {
    headers["x-time-travel"] = dimensions.timeTravel;
  }

  // Allow users to give their own Skylark to connect to
  const localStorageUri = localStorage.getItem(LOCAL_STORAGE.uri);
  const localStorageApiKey = localStorage.getItem(LOCAL_STORAGE.apikey);
  if (localStorageUri && localStorageApiKey) {
    return skylarkRequest<T>(localStorageUri, localStorageApiKey, query);
  }

  return graphQLClient.request<T>(query, {}, headers);
};
