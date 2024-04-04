import { gql } from "graphql-request";

// No Portuguese Genres have been added to the ingestor yet
export const LIST_GENRES = gql`
  query LIST_GENRES(
    $deviceType: String!
    $customerType: String!
    $region: String!
    $nextToken: String
  ) {
    listObjects: listGenre(
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
        { dimension: "regions", value: $region }
      ]
      next_token: $nextToken
      limit: 10
    ) {
      next_token
      objects {
        uid
        slug
        name
      }
    }
  }
`;
