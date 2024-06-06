import { gql } from "graphql-request";
import { ImageListingFragment } from "./fragments";

export const LIST_ARTICLES = gql`
  ${ImageListingFragment}
  query LIST_ARTICLES($nextToken: String) {
    listObjects: listArticle(next_token: $nextToken, limit: 50) {
      next_token
      objects {
        __typename
        uid
        external_id
        slug
        title
        type
        description
        body
        publish_date
        images {
          ...imageListingFragment
        }
      }
    }
  }
`;
