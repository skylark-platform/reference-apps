import { GraphQLClient } from "graphql-request";
import { Dimensions } from "../interfaces";
import {
  SAAS_ACCOUNT_ID,
  SAAS_API_ENDPOINT,
  SAAS_API_KEY,
} from "./skylark.constants";

export const graphQLClient = new GraphQLClient(SAAS_API_ENDPOINT, {
  headers: {
    "x-api-key": SAAS_API_KEY,
    "x-account-id": SAAS_ACCOUNT_ID,
  },
});

export const skylarkRequestWithDimensions = <T>(
  query: string,
  dimensions: Dimensions
) => {
  const headers: { [key: string]: string } = {};

  if (dimensions.timeTravel) {
    headers["x-time-travel"] = dimensions.timeTravel;
  }

  return graphQLClient.request<T>(query, {}, headers);
};
