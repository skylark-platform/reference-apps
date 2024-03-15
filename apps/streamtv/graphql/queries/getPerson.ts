import { gql } from "graphql-request";
import { ImageListingFragment } from "./fragments";

export const GET_PERSON_THUMBNAIL = gql`
  query GET_PERSON_THUMBNAIL(
    $uid: String!
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
  ) {
    getObject: getPerson(
      uid: $uid
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
        { dimension: "regions", value: $region }
      ]
    ) {
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

  query GET_PERSON(
    $uid: String
    $externalId: String
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
  ) {
    getObject: getPerson(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
        { dimension: "regions", value: $region }
      ]
    ) {
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
