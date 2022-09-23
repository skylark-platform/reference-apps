import { GraphQLClient } from "graphql-request";

const endpoint =
  "https://snjp62qr4fbvzfpf6xwlnpit54.appsync-api.eu-west-1.amazonaws.com/graphql";

const account = new Date().toISOString();
// const account = "test13"

export const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "x-api-key": "da2-ql6uljkn4vabjblyq4ty2sijhu",
    "x-account-id": account,
  },
});
