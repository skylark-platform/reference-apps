import { gql } from "graphql-request";
import { StreamTVAdditionalFields } from "../../types";

export const GET_BRAND_THUMBNAIL = gql`
  query GET_BRAND_THUMBNAIL(
    $uid: String!
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
  ) {
    getObject: getBrand(
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
      title
      title_short
      synopsis
      synopsis_short
      images {
        objects {
          uid
          title
          type
          url
        }
      }
      tags {
        objects {
          uid
          name
          type
        }
      }
    }
  }
`;

export const GET_BRAND = (streamTVIngestorSchemaLoaded: boolean) => gql`
  query GET_BRAND(
    $uid: String
    $externalId: String
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
  ) {
    getObject: getBrand(
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
      title
      title_short
      synopsis
      synopsis_short
      images {
        objects {
          uid
          title
          type
          url
        }
      }
      seasons {
        objects {
          uid
          season_number
          title
          title_short
          ${
            streamTVIngestorSchemaLoaded
              ? StreamTVAdditionalFields.PreferredImageType
              : ""
          }
          episodes {
            objects {
              uid
              episode_number
            }
          }
        }
      }
      tags {
        objects {
          uid
          name
        }
      }
      ratings {
        objects {
          uid
          value
        }
      }
    }
  }
`;
