import { gql } from "graphql-request";

/**
 * This Query is used to gather information about the Skylark Account SkylarkTV is connected to.
 * Mostly this checks to see whether the SkylarkTV ingestor has been run against this account and changes to the data model have been made.
 */
export const GET_SKYLARK_ENVIRONMENT = gql`
  query GET_SKYLARK_ENVIRONMENT {
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
    objectTypes: __type(name: "Metadata") {
      possibleTypes {
        name
      }
    }
  }
`;
