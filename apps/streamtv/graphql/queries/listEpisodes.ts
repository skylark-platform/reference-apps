import { gql } from "graphql-request";

export const LIST_EPISODES = gql`
  query LIST_EPISODES(
    $language: String!
    $customerType: String!
    $nextToken: String
  ) {
    listObjects: listEpisode(
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
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
    $customerType: String!
    $nextToken: String
  ) {
    getObject: getGenre(
      uid: $uid
      dimensions: [{ dimension: "customer-types", value: $customerType }]
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
