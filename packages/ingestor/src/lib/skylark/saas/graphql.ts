import { GraphQLClient } from "graphql-request";
import {
  SAAS_ACCOUNT_ID,
  SAAS_API_ENDPOINT,
  SAAS_API_KEY,
} from "../../constants";

const account = new Date().toISOString();
// const account = "test13"

export const graphQLClient = new GraphQLClient(SAAS_API_ENDPOINT, {
  headers: {
    "x-api-key": SAAS_API_KEY,
    "x-account-id": SAAS_ACCOUNT_ID || account,
  },
});
