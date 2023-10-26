import { gql } from "graphql-request";
import { CallToActionFragment, ImageListingFragment } from "./fragments";

export const GET_PAGE = gql`
  ${ImageListingFragment}
  ${CallToActionFragment}

  query GET_PAGE {
    getPage(external_id: "marketing-site-homepage") {
      uid
      seo_description
      seo_title
      slug
      content(limit: 100) {
        objects {
          object {
            __typename
            uid
            ... on Block {
              external_id
              slug
              title
              type
              copy
              appearance
              images {
                ...imageListingFragment
              }
              call_to_actions {
                objects {
                  ...callToActionFragment
                }
              }
            }
            ... on Embed {
              external_id
              slug
              type
              internal_title
              embed_id
            }
            ... on Section {
              slug
              internal_title
              title
              type
              content(limit: 100) {
                objects {
                  object {
                    uid
                    ... on Block {
                      external_id
                      slug
                      copy
                      internal_title
                      title
                      type
                      images {
                        ...imageListingFragment
                      }
                      content {
                        objects {
                          object {
                            uid
                            ... on FrequentlyAskedQuestion {
                              external_id
                              slug
                              answer
                              question
                              internal_title
                            }
                          }
                        }
                      }
                    }
                    ... on Testimonial {
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
              ...callToActionFragment
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
