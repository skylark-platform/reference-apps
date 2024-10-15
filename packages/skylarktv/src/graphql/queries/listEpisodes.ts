import { gql } from "graphql-request";

export const LIST_EPISODES = gql`
  query LIST_EPISODES($nextToken: String) {
    listObjects: listEpisode(next_token: $nextToken, limit: 20) {
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
  query LIST_EPISODES_BY_GENRE($uid: String!, $nextToken: String) {
    getObject: getGenre(uid: $uid) {
      episodes(next_token: $nextToken) {
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

// No Portuguese Genres have been added to the ingestor yet, so only set language on the movies relationship
export const LIST_EPISODES_BY_TAG = gql`
  query LIST_EPISODES_BY_TAG($uid: String!, $nextToken: String) {
    getObject: getSkylarkTag(uid: $uid) {
      episodes(next_token: $nextToken) {
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
