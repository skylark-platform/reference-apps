import { gql } from "graphql-request";

export const LIST_MOVIES = gql`
  query LIST_MOVIES(
    $language: String!
    $deviceType: String!
    $customerType: String!
    $nextToken: String
  ) {
    listObjects: listMovie(
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
      ]
      next_token: $nextToken
      limit: 10
    ) {
      next_token
      objects {
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
    $nextToken: String
  ) {
    getObject: getGenre(
      uid: $uid
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
      ]
    ) {
      movies(next_token: $nextToken, language: $language) {
        next_token
        objects {
          uid
        }
      }
    }
  }
`;
