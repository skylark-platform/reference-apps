import { gql } from "graphql-request";

export const GET_SET_THUMBNAIL = gql`
  query GET_SET_THUMBNAIL(
    $uid: String!
    $language: String!
    $deviceType: String!
    $customerType: String!
  ) {
    getObject: getSkylarkSet(
      uid: $uid
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
      ]
    ) {
      __typename
      type
      title
      title_short
      synopsis
      synopsis_short
      images {
        objects {
          title
          type
          url
        }
      }
    }
  }
`;

export const GET_SET_FOR_CAROUSEL = gql`
  query GET_SET_FOR_CAROUSEL(
    $uid: String!
    $language: String!
    $deviceType: String!
    $customerType: String!
  ) {
    getObject: getSkylarkSet(
      uid: $uid
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
      ]
    ) {
      uid
      content {
        objects {
          object {
            uid
            __typename
            ... on Movie {
              title
              title_short
              synopsis
              synopsis_short
              release_date
              images {
                objects {
                  url
                }
              }
              call_to_actions(limit: 1) {
                objects {
                  type
                  text
                  description
                }
              }
            }
            ... on Episode {
              title
              title_short
              synopsis
              synopsis_short
              release_date
              images {
                objects {
                  url
                }
              }
              call_to_actions(limit: 1) {
                objects {
                  type
                  text
                  description
                }
              }
            }
            ... on Season {
              title
              title_short
              synopsis
              synopsis_short
              release_date
              images {
                objects {
                  url
                }
              }
              call_to_actions(limit: 1) {
                objects {
                  type
                  text
                  description
                }
              }
            }
            ... on Brand {
              title
              title_short
              synopsis
              synopsis_short
              release_date
              images {
                objects {
                  url
                }
              }
              call_to_actions(limit: 1) {
                objects {
                  type
                  text
                  description
                }
              }
            }
            ... on SkylarkSet {
              title
              title_short
              synopsis
              synopsis_short
              images {
                objects {
                  url
                }
              }
              call_to_actions(limit: 1) {
                objects {
                  type
                  text
                  description
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_SET = gql`
  query GET_COLLECTION_SET(
    $uid: String
    $externalId: String
    $language: String!
    $deviceType: String!
    $customerType: String!
  ) {
    getObject: getSkylarkSet(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
      ]
    ) {
      uid
      type
      title
      title_short
      synopsis
      synopsis_short
      release_date
      images {
        objects {
          title
          type
          url
        }
      }
      ratings {
        objects {
          value
        }
      }
      content(limit: 50) {
        objects {
          object {
            __typename
            uid
          }
        }
      }
    }
  }
`;

export const GET_PAGE_SET = gql`
  query GET_PAGE_SET(
    $uid: String
    $externalId: String
    $language: String!
    $deviceType: String!
    $customerType: String!
  ) {
    getObject: getSkylarkSet(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
      ]
    ) {
      __typename
      uid
      title
      type
      content {
        objects {
          object {
            __typename
            ... on Season {
              uid
              title
              title_short
              episodes(limit: 50) {
                objects {
                  uid
                  episode_number
                  title
                }
              }
            }
            ... on SkylarkSet {
              uid
              type
              title
              title_short
              content(limit: 50) {
                objects {
                  object {
                    __typename
                    uid
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
