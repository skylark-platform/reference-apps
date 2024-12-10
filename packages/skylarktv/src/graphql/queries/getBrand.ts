import { gql } from "graphql-request";
import { SkylarkTVAdditionalFields } from "../../types";

export const GET_BRAND_THUMBNAIL = gql`
  query GET_BRAND_THUMBNAIL($uid: String!) {
    getObject: getBrand(uid: $uid) {
      __typename
      uid
      slug
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

export const GET_BRAND = (skylarkTVIngestorSchemaLoaded?: boolean) => gql`
  query GET_BRAND(
    $uid: String
    $externalId: String
  ) {
    getObject: getBrand(
      uid: $uid
      external_id: $externalId
    ) {
      uid
      slug
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
          slug
          season_number
          title
          title_short
          ${
            skylarkTVIngestorSchemaLoaded
              ? SkylarkTVAdditionalFields.PreferredImageType
              : ""
          }
          episodes {
            objects {
              uid
              slug
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
