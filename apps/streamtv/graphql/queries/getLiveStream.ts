import { gql } from "graphql-request";

export const GET_LIVE_STREAM_THUMBNAIL = gql`
  query GET_LIVE_STREAM_THUMBNAIL(
    $uid: String!
    $language: String!
    $deviceType: String!
    $customerType: String!
  ) {
    getObject: getLiveStream(
      uid: $uid
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
      ]
    ) {
      __typename
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
      tags {
        objects {
          name
          type
        }
      }
    }
  }
`;

export const GET_LIVE_STREAM = gql`
  query GET_LIVE_STREAM(
    $uid: String
    $externalId: String
    $language: String!
    $deviceType: String!
    $customerType: String!
  ) {
    getObject: getLiveStream(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
      ]
    ) {
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
      assets {
        objects {
          uid
          url
          hls_url
        }
      }
      live_assets {
        objects {
          uid
          url
          hls_url
        }
      }
      credits {
        objects {
          character
          people {
            objects {
              name
            }
          }
          roles {
            objects {
              internal_title
              title
              title_sort
            }
          }
        }
      }
      genres {
        objects {
          name
        }
      }
      themes {
        objects {
          name
        }
      }
      ratings {
        objects {
          value
        }
      }
      tags {
        objects {
          name
          type
        }
      }
      availability(limit: 20) {
        objects {
          end
        }
      }
    }
  }
`;
