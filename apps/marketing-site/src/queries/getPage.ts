import { gql } from "graphql-request";

export const ImageListingFragment = gql`
  fragment imageListingFragment on SkylarkImageListing {
    objects {
      title
      type
      url
    }
  }
`;

export const CallToActionListingFragment = gql`
  fragment callToActionListingFragment on CallToActionListing {
    objects {
      type
      text
      text_short
      description
      description_short
      url
      url_path
    }
  }
`;

export const GET_PAGE = gql`
  ${ImageListingFragment}

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
              images {
                ...imageListingFragment
              }
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
                      images {
                        ...imageListingFragment
                      }
                    }
                    ... on Testimonial {
                      uid
                      external_id
                      slug
                      copy
                      description
                      industry
                      title
                      internal_title
                      images {
                        ...imageListingFragment
                      }
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
              images {
                ...imageListingFragment
              }
            }
          }
          position
        }
      }
    }
  }
`;
