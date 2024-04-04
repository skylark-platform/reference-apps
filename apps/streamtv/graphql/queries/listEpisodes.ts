import { gql } from "graphql-request";

export const LIST_EPISODES = gql`
  query LIST_EPISODES(
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
    $nextToken: String
  ) {
    listObjects: listEpisode(
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
        slug
      }
    }
  }
`;

// No Portuguese Genres have been added to the ingestor yet, so only set language on the movies relationship
export const LIST_EPISODES_BY_GENRE = gql`
  query LIST_EPISODES_BY_GENRE(
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
      episodes(next_token: $nextToken, language: $language) {
        next_token
        objects {
          __typename
          uid
          slug
        }
      }
    }
  }
`;
