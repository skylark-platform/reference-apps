import { gql } from "graphql-request";
import { CallToActionListingFragment, ImageListingFragment } from "./fragments";
import { StreamTVAdditionalFields } from "../../types";

export const GET_SET_THUMBNAIL = gql`
  ${ImageListingFragment}

  query GET_SET_THUMBNAIL(
    $uid: String!
    $language: String!
    $customerType: String!
  ) {
    getObject: getCountrylineSet(
      uid: $uid
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
    ) {
      __typename
      uid
      type
      title_long
      title_medium
      title_short
      synopsis_long
      synopsis_medium
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
    $customerType: String!
  ) {
    getObject: getCountrylineSet(
      uid: $uid
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
    ) {
      uid
      content {
        objects {
          object {
            uid
            __typename
            ... on Movie {
              title_long
              title_medium
              title_short
              synopsis_long
              synopsis_medium
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
              title_long
              title_medium
              title_short
              synopsis_long
              synopsis_medium
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
              title_long
              title_medium
              title_short
              synopsis_long
              synopsis_medium
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
              title_long
              title_medium
              title_short
              synopsis_long
              synopsis_medium
              synopsis_short
              release_date
              images {
                ...imageListingFragment
              }
              call_to_actions(limit: 1) {
                ...callToActionListingFragment
              }
            }
            ... on CountrylineSet {
              title_long
              title_medium
              title_short
              synopsis_long
              synopsis_medium
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
    $customerType: String!
  ) {
    getObject: getCountrylineSet(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
    ) {
      uid
      type
      title_long
      title_medium
      title_short
      synopsis_long
      synopsis_medium
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
    $customerType: String!
  ) {
    getObject: getCountrylineSet(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [
        { dimension: "customer-types", value: $customerType }
      ]
    ) {
      __typename
      uid
      title_long
      title_medium
      type
      content(limit: 100) {
        objects {
          object {
            __typename
            uid
            ... on Season {
              title_long
              title_medium
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
                  title_long
                  title_medium
                  title_short
                }
              }
            }
            ... on CountrylineSet {
              type
              title_medium
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
