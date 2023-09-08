import { gql } from "graphql-request";

/**
 * This Query is used to get an active StreamTVConfig
 * It uses a list endpoint so it will use the first available StreamTV Config
 * Also fetches only a single logo
 */
export const GET_STREAMTV_CONFIG = gql`
  query GET_STREAMTV_CONFIG(
    $language: String!
    $deviceType: String!
    $customerType: String!
    $region: String!
  ) {
    listStreamtvConfig(
      limit: 1
      language: $language
      dimensions: [
        { dimension: "device-types", value: $deviceType }
        { dimension: "customer-types", value: $customerType }
        { dimension: "regions", value: $region }
      ]
    ) {
      objects {
        accent_color
        app_name
        google_analytics_id
        logo(limit: 1) {
          objects {
            uid
            url
            title
          }
        }
        primary_color
      }
    }
  }
`;
