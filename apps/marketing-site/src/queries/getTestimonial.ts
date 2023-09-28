import { gql } from "graphql-request";
import { ImageListingFragment, PeopleListingFragment } from "./fragments";

export const GET_TESTIMONIAL = gql`
  ${ImageListingFragment}
  ${PeopleListingFragment}

  query GET_TESTIMONIAL($uid: String, $externalId: String) {
    getTestimonial(uid: $uid, external_id: $externalId) {
      uid
      external_id
      slug
      copy
      description
      industry
      title
      internal_title
      images {
        ...imageListingFragment
      }
      people {
        ...peopleListingFragment
      }
    }
  }
`;
