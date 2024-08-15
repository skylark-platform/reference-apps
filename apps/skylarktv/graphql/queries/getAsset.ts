import { gql } from "graphql-request";
import { ImageListingFragment } from "./fragments";

export const GET_ASSET = gql`
  ${ImageListingFragment}

  query GET_ASSET($uid: String, $externalId: String) {
    getObject: getSkylarkAsset(uid: $uid, external_id: $externalId) {
      external_id
      slug
      title
      type
      images {
        ...imageListingFragment
      }
      chapters(limit: 100) {
        objects {
          uid
          start_time
          slug
          title
          chapter_type
          timecode_events(limit: 100) {
            objects {
              uid
              type
              slug
              copy
              link_text
              link_href
              timecode
            }
          }
        }
      }
      timecode_events(limit: 100) {
        objects {
          uid
          type
          slug
          copy
          link_text
          link_href
          timecode
        }
      }
    }
  }
`;
