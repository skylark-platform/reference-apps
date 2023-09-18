import { gql } from "graphql-request";

export const GET_PAGE = gql`
  query GET_PAGE {
    getPage(external_id: "marketing-site-homepage") {
      seo_description
      seo_title
      slug
      content(limit: 100) {
        objects {
          object {
            __typename
            ... on Block {
              external_id
              slug
              title
              type
              copy
              appearance
              uid
            }
            ... on Embed {
              external_id
              slug
              type
              internal_title
              embed_id
              uid
            }
            ... on Section {
              slug
              internal_title
              title
              type
              uid
              content(limit: 100) {
                objects {
                  object {
                    ... on Block {
                      external_id
                      slug
                      copy
                      internal_title
                      title
                      type
                      uid
                    }
                  }
                }
              }
            }
            ... on CallToAction {
              external_id
              slug
              appearance
              copy
              type
              uid
              url
              url_path
            }
          }
          position
        }
      }
    }
  }
`;
