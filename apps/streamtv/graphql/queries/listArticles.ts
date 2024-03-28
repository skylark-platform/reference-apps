import { gql } from "graphql-request";
import { ImageListingFragment } from "./fragments";

export const LIST_ARTICLES = gql`
  ${ImageListingFragment}

  query LIST_ARTICLES(
    $language: String!
    $customerType: String!
    $nextToken: String
  ) {
    listObjects: listArticle(
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
      next_token: $nextToken
      limit: 50
    ) {
      next_token
      objects {
        __typename
        uid
        external_id
        slug
        title
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
