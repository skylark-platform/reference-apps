import { gql } from "graphql-request";

/**
 * This Query is used to get an active SkylarkTVConfig
 * It uses a list endpoint so it will use the first available SkylarkTV Config
 * Also fetches only a single logo
 */
export const GET_SKYLARKTV_CONFIG = gql`
  query GET_SKYLARKTV_CONFIG {
    listSkylarktvConfig(limit: 1) {
      objects {
        uid
        app_name
        primary_color
        accent_color
        featured_page_url
        google_tag_manager_id
        logo(limit: 1) {
          objects {
            uid
            url
            title
            slug
          }
        }
      }
    }
  }
`;
