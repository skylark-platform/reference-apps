import { gql } from "graphql-request";

const movieListingFragment = gql`
  fragment movieListingFragment on MovieListing {
    next_token
    objects {
      __typename
      uid
      slug
      title
      title_short
      synopsis
      synopsis_short
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

export const LIST_MOVIES = gql`
  ${movieListingFragment}

  query LIST_MOVIES($nextToken: String) {
    listObjects: listMovie(next_token: $nextToken, limit: 20) {
      ...movieListingFragment
    }
  }
`;

export const LIST_MOVIES_BY_GENRE = gql`
  ${movieListingFragment}

  query LIST_MOVIES_BY_GENRE($uid: String!, $nextToken: String) {
    getObject: getGenre(uid: $uid) {
      movies(next_token: $nextToken, limit: 20) {
        ...movieListingFragment
      }
    }
  }
`;

export const LIST_MOVIES_BY_TAG = gql`
  ${movieListingFragment}

  query LIST_MOVIES_BY_TAG($uid: String!, $nextToken: String) {
    getObject: getSkylarkTag(uid: $uid) {
      name
      movies(next_token: $nextToken, limit: 20) {
        ...movieListingFragment
      }
    }
  }
`;
