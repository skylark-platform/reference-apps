import { CreditTypes, ImageTypes } from "@skylark-reference-apps/lib";
import { Credit, GenreListing, ImageListing, Maybe, RatingListing, ThemeListing } from "../types/gql";

export const getGraphQLCreditsByType = (credits: Maybe<Maybe<Credit>[]> | null | undefined, type: CreditTypes): Credit[] => {
  if (!credits) {
    return [];
  }

  return credits.filter((credit) => credit?.roles?.objects?.[0]?.title === type) as Credit[];
}

export const formatGraphQLCredits = (credits: Credit[]) => {
  const showCharacterName = credits.length <= 4;
  return credits.map((credit) => {
    const name = credit?.people?.objects?.[0]?.name || "";
    return showCharacterName && credit?.character && credit?.people?.objects?.[0]?.name
      ? `${name} as ${credit?.character}`
      : name
  })
}

export const convertObjectToName = (listing: Maybe<ThemeListing> | Maybe<GenreListing> | undefined): string[] => {
  if(!listing || !listing.objects || listing.objects.length === 0) {
    return []
  }
  return listing?.objects?.map((obj) =>
  obj && obj.name ? obj.name : ""
) || []
}

export const getFirstRatingValue = (ratings: Maybe<RatingListing> | undefined): string => {
  if(!ratings || !ratings.objects || ratings.objects.length === 0) {
    return ""
  }
  return ratings?.objects?.[0]?.value || ""
}

export const getGraphQLImageSrc = (
  images: Maybe<ImageListing> | undefined,
  type: ImageTypes,
): string => {
  if (!images || !images.objects || images.objects.length === 0) {
    return "";
  }

  // Filter any Images with an empty URL
  const imagesWithUrls = images.objects.filter((img) => !!img?.image_url);
  if (imagesWithUrls.length === 0) {
    return "";
  }

  // Default to first image if no matching type is found
  const image = imagesWithUrls.find((img) => img?.image_type === type) || imagesWithUrls[0];

  return image?.image_url || "";
};
