import { gql } from "graphql-request";

export const LIST_MOVIES = gql`
  query LIST_MOVIES($nextToken: String) {
    listObjects: listMovie(next_token: $nextToken, limit: 20) {
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
export const LIST_MOVIES_BY_GENRE = gql`
  query LIST_MOVIES_BY_GENRE($uid: String!, $nextToken: String) {
    getObject: getGenre(uid: $uid) {
      movies(next_token: $nextToken) {
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
