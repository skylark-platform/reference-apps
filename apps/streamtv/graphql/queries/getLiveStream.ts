import { gql } from "graphql-request";

export const GET_LIVE_STREAM = gql`
  query GET_LIVE_STREAM(
    $uid: String
    $externalId: String
    $language: String!
    $deviceType: String!
    $customerType: String!
  ) {
    getObject: getLiveStream(
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
          hls_url
        }
      }
      tags {
        objects {
          name
          type
        }
      }
      availability(limit: 20) {
        objects {
          end
        }
      }
    }
  }
`;
