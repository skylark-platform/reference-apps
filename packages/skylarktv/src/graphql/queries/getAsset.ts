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
      policy
      images {
        ...imageListingFragment
      }
    }
  }
`;
