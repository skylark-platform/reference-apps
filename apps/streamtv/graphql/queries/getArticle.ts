import { gql } from "graphql-request";
import { ImageListingFragment } from "./fragments";

export const GET_ARTICLE_THUMBNAIL = gql`
  query GET_ARTICLE_THUMBNAIL(
    $uid: String!
    $language: String!
    $customerType: String!
  ) {
    getObject: getArticle(
      uid: $uid
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
    ) {
      uid
      __typename
      external_id
      slug
      title
      type
      description
      publish_date
      images {
        objects {
          uid
          title
          type
          url
        }
      }
    }
  }
`;

export const GET_ARTICLE = gql`
  ${ImageListingFragment}

  query GET_ARTICLE(
    $uid: String
    $externalId: String
    $language: String!
    $customerType: String!
  ) {
    getObject: getArticle(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
    ) {
      external_id
      slug
      title
      description
      body
      type
      publish_date
      images {
        ...imageListingFragment
      }
      credits {
        objects {
          uid
          character
          people {
            objects {
              uid
              name
            }
          }
          roles {
            objects {
              uid
              internal_title
              title
              title_sort
            }
          }
        }
      }
    }
  }
`;
