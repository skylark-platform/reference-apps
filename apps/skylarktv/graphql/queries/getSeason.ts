import { gql } from "graphql-request";

export const GET_SEASON_THUMBNAIL = gql`
  query GET_SEASON_THUMBNAIL($uid: String, $externalId: String) {
    getObject: getSeason(uid: $uid, external_id: $externalId) {
      __typename
      uid
      slug
      title
      title_short
      synopsis
      synopsis_short
      release_date
      season_number
      images {
        objects {
          uid
          title
          type
          url
        }
      }
    }
  }
`;

export const GET_SEASON_AND_EPISODES = gql`
  query GET_SEASON_AND_EPISODES($uid: String, $externalId: String) {
    getObject: getSeason(uid: $uid, external_id: $externalId) {
      __typename
      uid
      slug
      title
      title_short
      synopsis
      synopsis_short
      release_date
      season_number
      episodes(limit: 20) {
        objects {
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
    }
  }
`;
