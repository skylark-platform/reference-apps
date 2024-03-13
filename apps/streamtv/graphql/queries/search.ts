import { gql } from "graphql-request";
import { ImageListingFragment } from "./fragments";

export const SEARCH = gql`
  ${ImageListingFragment}

  query SEARCH($query: String!, $language: String!, $customerType: String!) {
    search(
      query: $query
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
      highlight_results: true
    ) {
      total_count
      objects {
        __typename
        uid
        external_id
        _context {
          typename_highlight
        }
        ... on CountrylineSet {
          title_long
          title_medium
          title_short
          synopsis_long
          synopsis_medium
          synopsis_short
          type
          images {
            ...imageListingFragment
          }
        }
        ... on Brand {
          title
          title_short
          synopsis_medium
          synopsis_short
          release_date
          images {
            ...imageListingFragment
          }
        }
        ... on Episode {
          title
          title_short
          synopsis_medium
          synopsis_short
          release_date
          images {
            ...imageListingFragment
          }
        }
        ... on Movie {
          title
          title_short
          synopsis_medium
          synopsis_short
          release_date
          images {
            ...imageListingFragment
          }
        }
        #... on Person {
        #  name
        #  images {
        #    ...imageListingFragment
        #  }
        #}
      }
    }
  }
`;
