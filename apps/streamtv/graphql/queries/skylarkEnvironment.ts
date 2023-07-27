import { gql } from "graphql-request";

/**
 * This Query is used to gather information about the Skylark Account StreamTV is connected to.
 * Mostly this checks to see whether the StreamTV ingestor has been run against this account and changes to the data model have been made.
 */
export const GET_SKYLARK_ENVIRONMENT = gql`
  query {
    seasonFields: __type(name: "Season") {
      possibleTypes {
        kind
        name
      }
      name
      kind
      fields {
        name
      }
    }
  }
`;
