import { gql } from "graphql-request";

export const GET_MOVIE_THUMBNAIL = gql`
  query GET_MOVIE_THUMBNAIL(
    $uid: String!
    $language: String!
    $customerType: String!
  ) {
    getObject: getMovie(
      uid: $uid
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
    ) {
      uid
      __typename
      title
      title_short
      synopsis_medium
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

export const GET_MOVIE = gql`
  query GET_MOVIE(
    $uid: String
    $externalId: String
    $language: String!
    $customerType: String!
  ) {
    getObject: getMovie(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
    ) {
      uid
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
      assets {
        objects {
          uid
          url
          hls_url
        }
      }
      brands {
        objects {
          uid
          title
          title_short
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
