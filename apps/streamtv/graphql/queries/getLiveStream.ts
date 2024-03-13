import { gql } from "graphql-request";

export const GET_LIVE_STREAM_THUMBNAIL = gql`
  query GET_LIVE_STREAM_THUMBNAIL(
    $uid: String!
    $language: String!
    $customerType: String!
  ) {
    getObject: getLiveStream(
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

export const GET_LIVE_STREAM = gql`
  query GET_LIVE_STREAM(
    $uid: String
    $externalId: String
    $language: String!
    $customerType: String!
  ) {
    getObject: getLiveStream(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
    ) {
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
          uid
          character
          people {
            objects {
              uid
              name
            }
          }
          roles {
            objects {
              uid
              internal_title
              title
              title_sort
            }
          }
        }
      }
      genres {
        objects {
          uid
          name
        }
      }
      themes {
        objects {
          name
          uid
        }
      }
      ratings {
        objects {
          value
          uid
        }
      }
      tags {
        objects {
          uid
          name
          type
        }
      }
      availability(limit: 20) {
        objects {
          uid
          end
        }
      }
    }
  }
`;
