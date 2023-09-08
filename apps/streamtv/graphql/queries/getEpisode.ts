import { gql } from "graphql-request";

export const GET_EPISODE_THUMBNAIL = gql`
  query GET_EPISODE_THUMBNAIL(
    $uid: String!
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
  ) {
    getObject: getEpisode(
      uid: $uid
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
        { dimension: "regions", value: $region }
      ]
    ) {
      __typename
      title
      title_short
      synopsis
      synopsis_short
      episode_number
      release_date
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

export const GET_EPISODE = gql`
  query GET_EPISODE(
    $uid: String
    $externalId: String
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
  ) {
    getObject: getEpisode(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
        { dimension: "regions", value: $region }
      ]
    ) {
      title
      title_short
      synopsis
      synopsis_short
      episode_number
      release_date
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
      seasons {
        objects {
          uid
          season_number
          title
          title_short
          brands {
            objects {
              uid
              title
              title_short
            }
          }
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
