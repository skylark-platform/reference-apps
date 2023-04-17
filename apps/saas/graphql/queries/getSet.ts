import { gql } from "graphql-request";

export const GET_SET_THUMBNAIL = gql`
query GET_SET_THUMBNAIL (
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
  getSkylarkSet(
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
          }
        }
      }
    }
  }
}
`;
