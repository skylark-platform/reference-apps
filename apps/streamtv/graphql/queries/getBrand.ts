import { gql } from "graphql-request";
import { StreamTVAdditionalFields } from "../../types";

export const GET_BRAND_THUMBNAIL = gql`
  query GET_BRAND_THUMBNAIL(
    $uid: String!
    $language: String!
    $customerType: String!
  ) {
    getObject: getBrand(
      uid: $uid
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
    ) {
      __typename
      uid
      title
      title_short
      synopsis_medium
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
    $customerType: String!
  ) {
    getObject: getBrand(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [
        { dimension: "customer-types", value: $customerType }
      ]
    ) {
      uid
      title_long
      title_medium
      title_short
      synopsis_long
      synopsis_medium
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
          title_long
          title_medium
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
