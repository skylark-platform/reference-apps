import { gql } from "graphql-request";

export const LIST_MOVIES = gql`
  query LIST_MOVIES(
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
    $nextToken: String
  ) {
    listObjects: listMovie(
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
        { dimension: "regions", value: $region }
      ]
      next_token: $nextToken
      limit: 20
    ) {
      next_token
      objects {
        __typename
        uid
      }
    }
  }
`;

// No Portuguese Genres have been added to the ingestor yet, so only set language on the movies relationship
export const LIST_MOVIES_BY_GENRE = gql`
  query LIST_MOVIES_BY_GENRE(
    $uid: String!
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
    $nextToken: String
  ) {
    getObject: getGenre(
      uid: $uid
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
        { dimension: "regions", value: $region }
      ]
    ) {
      movies(next_token: $nextToken, language: $language) {
        next_token
        objects {
          __typename
          uid
        }
      }
    }
  }
`;
