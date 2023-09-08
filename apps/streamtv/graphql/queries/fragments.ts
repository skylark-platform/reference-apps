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
  fragment callToActionListingFragment on CallToActionListing {
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

export const ObjectLanguageFragment = gql`
  fragment objectLanguageFragment on Metadata {
    ... on Episode {
      _meta {
        language_data {
          language
        }
      }
    }
    ... on Season {
      _meta {
        language_data {
          language
        }
      }
    }
    ... on Brand {
      _meta {
        language_data {
          language
        }
      }
    }
    ... on Movie {
      _meta {
        language_data {
          language
        }
      }
    }
    ... on SkylarkSet {
      _meta {
        language_data {
          language
        }
      }
    }
    ... on SkylarkAsset {
      _meta {
        language_data {
          language
        }
      }
    }
    ... on SkylarkLiveAsset {
      _meta {
        language_data {
          language
        }
      }
    }
    ... on LiveStream {
      _meta {
        language_data {
          language
        }
      }
    }
  }
`;
