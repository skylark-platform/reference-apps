import { graphQLClient } from "@skylark-reference-apps/lib";
import { gql } from "graphql-request";

const SET_ACCOUNT_CONFIGURATION = gql`
  mutation SET_ACCOUNT_CONFIGURATION($defaultLanguage: String!) {
    setAccountConfiguration(
      account_config: { default_language: $defaultLanguage }
    ) {
      account_id
      config {
        default_language
      }
    }
  }
`;

export const setAccountConfiguration = async (variables: {
  defaultLanguage: string;
}) => {
  await graphQLClient.uncachedRequest(SET_ACCOUNT_CONFIGURATION, variables);
};
