import { gql } from "graphql-request";

export const SEARCH = gql`
  query SEARCH(
    $query: String!
    $language: String!
    $deviceType: String!
    $customerType: String!
  ) {
    search(
      query: $query
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
      ]
    ) {
      total_count
      objects {
        __typename
        uid
        ... on Brand {
          title
          title_short
          synopsis
          synopsis_short
          release_date
        }
        ... on Episode {
          title
          title_short
          synopsis
          synopsis_short
          release_date
        }
        ... on Movie {
          title
          title_short
          synopsis
          synopsis_short
          release_date
        }
        ... on Person {
          name
        }
      }
    }
  }
`;
