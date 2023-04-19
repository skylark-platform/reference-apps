import { gql } from "graphql-request";

export const SEARCH = gql`
  fragment imageListing on SkylarkImageListing {
    objects {
      title
      type
      url
    }
  }

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
    ) # types: ["COLLECTION"]
    # highlight_results: true
    {
      total_count
      objects {
        __typename
        uid
        ... on SkylarkSet {
          title
          title_short
          synopsis
          synopsis_short
          type
          images {
            ...imageListing
          }
        }
        ... on Brand {
          title
          title_short
          synopsis
          synopsis_short
          release_date
          images {
            ...imageListing
          }
        }
        ... on Episode {
          title
          title_short
          synopsis
          synopsis_short
          release_date
          images {
            ...imageListing
          }
        }
        ... on Movie {
          title
          title_short
          synopsis
          synopsis_short
          release_date
          images {
            ...imageListing
          }
        }
        ... on Person {
          name
          images {
            ...imageListing
          }
        }
      }
    }
  }
`;
