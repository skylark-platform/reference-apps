import { gql } from "graphql-request";

export const GET_MOVIE_THUMBNAIL = gql`
  query GET_MOVIE_THUMBNAIL(
    $uid: String!
    $language: String!
    $deviceType: String!
    $customerType: String!
  ) {
    getObject: getMovie(
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

export const GET_MOVIE = gql`
  query GET_MOVIE(
    $uid: String
    $externalId: String
    $language: String!
    $deviceType: String!
    $customerType: String!
  ) {
    getObject: getMovie(
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
      brands {
        objects {
          uid
          title
          title_short
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
