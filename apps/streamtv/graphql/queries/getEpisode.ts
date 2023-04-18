import { gql } from "graphql-request";

export const GET_EPISODE_THUMBNAIL = gql`
  query GET_EPISODE_THUMBNAIL(
    $uid: String!
    $language: String!
    $deviceType: String!
    $customerType: String!
  ) {
    getObject: getEpisode(
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
      episode_number
      release_date
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

export const GET_EPISODE = gql`
  query GET_EPISODE(
    $uid: String
    $externalId: String
    $language: String!
    $deviceType: String!
    $customerType: String!
  ) {
    getObject: getEpisode(
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
              title
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
    }
  }
`;
