import { gql } from "graphql-request";

export const ImageListingFragment = gql`
  fragment imageListingFragment on SkylarkImageListing {
    objects {
      uid
      title
      type
      url
    }
  }
`;

export const CallToActionFragment = gql`
  fragment callToActionFragment on CallToAction {
    external_id
    slug
    appearance
    copy
    type
    uid
    url
    url_path
    button_text
    scroll_to_id
  }
`;

export const PeopleListingFragment = gql`
  fragment peopleListingFragment on PersonListing {
    objects {
      uid
      external_id
      slug
      bio
      company
      name
      role
      images {
        ...imageListingFragment
      }
    }
  }
`;
