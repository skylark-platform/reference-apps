import {
  CreditTypes,
  Dimensions,
  DimensionTypes,
  EntertainmentType,
  getSynopsisByOrder,
  getTitleByOrder,
  GraphQLMediaObjectTypes,
  ImageTypes,
  SetTypes,
  SynopsisTypes,
  TitleTypes,
} from "@skylark-reference-apps/lib";
import {
  Credit,
  Entertainment,
  Episode,
  GenreListing,
  ImageListing,
  Maybe,
  RatingListing,
  ThemeListing,
} from "../types/gql";

export const getGraphQLCreditsByType = (
  credits: Maybe<Maybe<Credit>[]> | null | undefined,
  type: CreditTypes
): Credit[] => {
  if (!credits) {
    return [];
  }

  return credits.filter(
    (credit) => credit?.roles?.objects?.[0]?.title === type
  ) as Credit[];
};

export const formatGraphQLCredits = (credits: Credit[]) => {
  const showCharacterName = credits.length <= 4;
  return credits.map((credit) => {
    const name = credit?.people?.objects?.[0]?.name || "";
    return showCharacterName &&
      credit?.character &&
      credit?.people?.objects?.[0]?.name
      ? `${name} as ${credit?.character}`
      : name;
  });
};

export const convertObjectToName = (
  listing: Maybe<ThemeListing> | Maybe<GenreListing> | undefined
): string[] => {
  if (!listing || !listing.objects || listing.objects.length === 0) {
    return [];
  }
  return (
    listing?.objects?.map((obj) => (obj && obj.name ? obj.name : "")) || []
  );
};

export const getFirstRatingValue = (
  ratings: Maybe<RatingListing> | undefined
): string => {
  if (!ratings || !ratings.objects || ratings.objects.length === 0) {
    return "";
  }
  return ratings?.objects?.[0]?.value || "";
};

export const getGraphQLImageSrc = (
  images: Maybe<ImageListing> | undefined,
  type: ImageTypes
): string => {
  if (!images || !images.objects || images.objects.length === 0) {
    return "";
  }

  // Filter any Images with an empty URL
  const imagesWithUrls = images.objects.filter((img) => !!img?.url);
  if (imagesWithUrls.length === 0) {
    return "";
  }

  // Default to first image if no matching type is found
  const image =
    imagesWithUrls.find((img) => img?.type === type) || imagesWithUrls[0];

  return image?.url || "";
};

export const getTitleByOrderForGraphQLObject = (
  obj?: Entertainment | Maybe<Entertainment>,
  priority?: TitleTypes[]
) => {
  if (!obj) {
    return "";
  }
  return getTitleByOrder(
    {
      short: obj?.title_short || "",
      medium: obj?.title_medium || "",
      long: obj?.title_long || "",
    },
    priority
  );
};

export const getSynopsisByOrderForGraphQLObject = (
  obj?: Entertainment,
  priority?: SynopsisTypes[]
) => {
  if (!obj) {
    return "";
  }
  return getSynopsisByOrder(
    {
      short: obj?.synopsis_short || "",
      medium: obj?.synopsis_medium || "",
      long: obj?.synopsis_long || "",
    },
    priority
  );
};

export const createGraphQLQueryDimensions = (activeDimensions: Dimensions) => {
  const dimensions: { dimension: DimensionTypes; value: string }[] = [
    { dimension: "device-types", value: activeDimensions.deviceType },
    { dimension: "customer-types", value: activeDimensions.customerType },
  ];

  return {
    language: activeDimensions.language,
    dimensions,
  };
};

export const convertTypenameToEntertainmentType = (
  typename: GraphQLMediaObjectTypes | "Set" | undefined
): EntertainmentType => {
  switch (typename) {
    case "Episode":
      return "episode";
    case "Movie":
      return "movie";
    case "Season":
      return "season";
    default:
      return "brand";
  }
};

export const convertGraphQLSetType = (setType?: string): SetTypes => {
  switch (setType) {
    case "COLLECTION":
      return "collection";
    case "SLIDER":
      return "slider";
    case "RAIL":
      return "rail";
    default:
      return "homepage";
  }
};

export const sortEpisodesByNumber = (a: Maybe<Episode>, b: Maybe<Episode>) =>
  (a?.episode_number || 0) > (b?.episode_number || 0) ? 1 : -1;
