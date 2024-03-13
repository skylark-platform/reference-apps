import { gql } from "graphql-request";

export const GET_SEASON_THUMBNAIL = gql`
  query GET_SEASON_THUMBNAIL(
    $uid: String
    $externalId: String
    $language: String!
    $customerType: String!
  ) {
    getObject: getSeason(
      uid: $uid
      external_id: $externalId
      language: $language
      dimensions: [{ dimension: "customer-types", value: $customerType }]
    ) {
      __typename
      uid
      title_long
      title_medium
      title_short
      synopsis_long
      synopsis_medium
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
