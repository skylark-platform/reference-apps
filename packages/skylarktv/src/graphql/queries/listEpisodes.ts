import { gql } from "graphql-request";

const episodeListingFragment = gql`
  fragment episodeListingFragment on EpisodeListing {
    next_token
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
`;

export const LIST_EPISODES = gql`
  ${episodeListingFragment}

  query LIST_EPISODES($nextToken: String) {
    listObjects: listEpisode(next_token: $nextToken, limit: 20) {
      ...episodeListingFragment
    }
  }
`;

// No Portuguese Genres have been added to the ingestor yet, so only set language on the movies relationship
export const LIST_EPISODES_BY_GENRE = gql`
  ${episodeListingFragment}

  query LIST_EPISODES_BY_GENRE($uid: String!, $nextToken: String) {
    getObject: getGenre(uid: $uid) {
      episodes(next_token: $nextToken) {
        ...episodeListingFragment
      }
    }
  }
`;

// No Portuguese Genres have been added to the ingestor yet, so only set language on the movies relationship
export const LIST_EPISODES_BY_TAG = gql`
  ${episodeListingFragment}

  query LIST_EPISODES_BY_TAG($uid: String!, $nextToken: String) {
    getObject: getSkylarkTag(uid: $uid) {
      episodes(next_token: $nextToken) {
        ...episodeListingFragment
      }
    }
  }
`;
