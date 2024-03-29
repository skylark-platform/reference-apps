import { gql } from "graphql-request";
import { CallToActionListingFragment, ImageListingFragment } from "./fragments";
import { StreamTVAdditionalFields } from "../../types";

export const GET_SET_THUMBNAIL = gql`
  ${ImageListingFragment}

  query GET_SET_THUMBNAIL(
    $uid: String!
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
  ) {
    getObject: getSkylarkSet(
      uid: $uid
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
        { dimension: "regions", value: $region }
      ]
    ) {
      __typename
      uid
      type
      title
      title_short
      synopsis
      synopsis_short
      images {
        ...imageListingFragment
      }
    }
  }
`;

export const GET_SET_FOR_CAROUSEL = gql`
  ${ImageListingFragment}
  ${CallToActionListingFragment}

  query GET_SET_FOR_CAROUSEL(
    $uid: String!
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
  ) {
    getObject: getSkylarkSet(
      uid: $uid
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
        { dimension: "regions", value: $region }
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
                ...imageListingFragment
              }
              call_to_actions(limit: 1) {
                ...callToActionListingFragment
              }
            }
            ... on Episode {
              title
              title_short
              synopsis
              synopsis_short
              release_date
              images {
                ...imageListingFragment
              }
              call_to_actions(limit: 1) {
                ...callToActionListingFragment
              }
            }
            ... on Season {
              title
              title_short
              synopsis
              synopsis_short
              release_date
              images {
                ...imageListingFragment
              }
              call_to_actions(limit: 1) {
                ...callToActionListingFragment
              }
            }
            ... on Brand {
              title
              title_short
              synopsis
              synopsis_short
              release_date
              images {
                ...imageListingFragment
              }
              call_to_actions(limit: 1) {
                ...callToActionListingFragment
              }
            }
            ... on LiveStream {
              title
              title_short
              synopsis
              synopsis_short
              images {
                ...imageListingFragment
              }
              call_to_actions(limit: 1) {
                ...callToActionListingFragment
              }
            }
            ... on SkylarkSet {
              title
              title_short
              synopsis
              synopsis_short
              images {
                ...imageListingFragment
              }
              call_to_actions(limit: 1) {
                ...callToActionListingFragment
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_SET = gql`
  ${ImageListingFragment}

  query GET_COLLECTION_SET(
    $uid: String
    $externalId: String
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
  ) {
    getObject: getSkylarkSet(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
        { dimension: "regions", value: $region }
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
        ...imageListingFragment
      }
      ratings {
        objects {
          uid
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

export const GET_PAGE_SET = (streamTVIngestorSchemaLoaded: boolean) => gql`
  query GET_PAGE_SET(
    $uid: String
    $externalId: String
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
  ) {
    getObject: getSkylarkSet(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
        { dimension: "regions", value: $region }
      ]
    ) {
      __typename
      uid
      title
      title_short
      type
      content(limit: 100) {
        objects {
          object {
            __typename
            uid
            ... on Season {
              title
              title_short
              ${
                streamTVIngestorSchemaLoaded
                  ? StreamTVAdditionalFields.PreferredImageType
                  : ""
              }
              episodes(limit: 50) {
                objects {
                  uid
                  episode_number
                  title
                  title_short
                }
              }
            }
            ... on SkylarkSet {
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
            ... on CallToAction {
              text
            }
            ... on SkylarkTag {
              brands(limit: 50) {
                objects {
                  __typename
                  uid
                }
              }
              movies(limit: 50) {
                objects {
                  __typename
                }
              }
            }
          }
        }
      }
    }
  }
`;
