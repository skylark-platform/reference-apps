import { gql } from "graphql-request";

export const GET_SEASON_THUMBNAIL = gql`
  query GET_SEASON_THUMBNAIL(
    $uid: String
    $externalId: String
    $language: String!
    $deviceType: String!
    $customerType: String!
  ) {
    getObject: getSeason(
      uid: $uid
      external_id: $externalId
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
      season_number
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
