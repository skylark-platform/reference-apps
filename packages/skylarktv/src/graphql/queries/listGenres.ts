import { gql } from "graphql-request";

export const LIST_GENRES = gql`
  query LIST_GENRES($nextToken: String) {
    listObjects: listGenre(next_token: $nextToken, limit: 10) {
      next_token
      objects {
        uid
        slug
        name
      }
    }
  }
`;
