import { gql } from "graphql-request";
import { ImageListingFragment } from "./fragments";

export const GET_PERSON_THUMBNAIL = gql`
  query GET_PERSON_THUMBNAIL($uid: String!) {
    getObject: getPerson(uid: $uid) {
      uid
      __typename
      name
      bio_long
      bio_medium
      bio_short
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

export const GET_PERSON = gql`
  ${ImageListingFragment}

  query GET_PERSON($uid: String, $externalId: String) {
    getObject: getPerson(uid: $uid, external_id: $externalId) {
      external_id
      slug
      abbreviation
      alias
      bio_long
      bio_medium
      bio_short
      genre
      name
      date_of_birth
      name_sort
      place_of_birth
      images {
        ...imageListingFragment
      }
      credits {
        objects {
          uid
          movies {
            objects {
              uid
            }
          }
          episodes {
            objects {
              uid
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
    }
  }
`;

export const GET_PERSON_FOR_RELATED_CREDITS = gql`
  query GET_PERSON_FOR_RELATED_CREDITS($uid: String, $externalId: String) {
    getObject: getPerson(uid: $uid, external_id: $externalId) {
      external_id
      slug
      name
      name_sort
      credits(limit: 50) {
        objects {
          uid
          movies(limit: 20) {
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
    }
  }
`;
