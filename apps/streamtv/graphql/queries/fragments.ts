import { gql } from "graphql-request";

export const ImageListingFragment = gql`
  fragment imageListingFragment on SkylarkImageListing {
    objects {
      title
      type
      url
    }
  }
`;

export const CallToActionListingFragment = gql`
  fragment callToActionListingFragment on SkylarkCallToActionListing {
    objects {
      type
      text
      text_short
      description
      description_short
      url
      url_path
    }
  }
`;
