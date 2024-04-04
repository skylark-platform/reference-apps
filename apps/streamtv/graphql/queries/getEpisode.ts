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
      uid
      slug
      title
      title_short
      synopsis
      synopsis_short
      episode_number
      release_date
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
      uid
      slug
      title
      title_short
      synopsis
      synopsis_short
      episode_number
      release_date
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
      seasons {
        objects {
          uid
          season_number
          title
          title_short
          slug
          brands {
            objects {
              uid
              title
              title_short
              slug
            }
          }
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
