import { gql } from "graphql-request";
import { ImageListingFragment } from "./fragments";

export const SEARCH = gql`
  ${ImageListingFragment}

  query SEARCH($query: String!) {
    search(query: $query, highlight_results: true) {
      total_count
      objects {
        __typename
        uid
        external_id
        _context {
          typename_highlight
        }
        ... on SkylarkSet {
          title
          title_short
          synopsis
          synopsis_short
          type
          images {
            ...imageListingFragment
          }
        }
        ... on Brand {
          title
          title_short
          synopsis
          synopsis_short
          release_date
          images {
            ...imageListingFragment
          }
        }
        ... on Episode {
          title
          title_short
          synopsis
          synopsis_short
          release_date
          images {
            ...imageListingFragment
          }
        }
        ... on Movie {
          title
          title_short
          synopsis
          synopsis_short
          release_date
          images {
            ...imageListingFragment
          }
        }
        ... on Person {
          name
          images {
            ...imageListingFragment
          }
        }
        ... on LiveStream {
          title
          title_short
          synopsis
          synopsis_short
          images {
            ...imageListingFragment
          }
        }
      }
    }
  }
`;
