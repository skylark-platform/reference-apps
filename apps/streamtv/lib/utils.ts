import {
  CreditTypes,
  Dimensions,
  DimensionTypes,
  EntertainmentType,
  getSynopsisByOrder,
  getTitleByOrder,
  GraphQLObjectTypes,
  MetadataType,
  SetTypes,
  SynopsisTypes,
  TitleTypes,
} from "@skylark-reference-apps/lib";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Credit,
  Entertainment,
  GenreListing,
  SkylarkImageListing,
  ImageType,
  Maybe,
  RatingListing,
  SkylarkTagListing,
  ThemeListing,
  Availability,
} from "../types";

dayjs.extend(relativeTime);

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
  listing:
    | Maybe<ThemeListing>
    | Maybe<GenreListing>
    | Maybe<SkylarkTagListing>
    | undefined
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
  images: Maybe<SkylarkImageListing> | undefined,
  type: ImageType
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
      title: obj?.title || "",
      title_short: obj?.title_short || "",
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
      synopsis: obj?.synopsis || "",
      synopsis_short: obj?.synopsis_short || "",
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

export const convertTypenameToObjectType = (
  typename: GraphQLObjectTypes | undefined
): EntertainmentType | MetadataType => {
  switch (typename) {
    case "Episode":
      return "episode";
    case "Movie":
      return "movie";
    case "Season":
      return "season";
    case "Person":
      return "person";
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
      return "page";
  }
};

export const getFurthestAvailabilityEndDate = (
  objects?: Availability[] | null
): Dayjs | null => {
  if (!objects || objects.length === 0) {
    return null;
  }

  const orderedDates = objects
    ?.filter(({ end }) => !!end)
    .sort(({ end: endA }, { end: endB }) =>
      dayjs(endA as string).isBefore(endB as string) ? 1 : -1
    );
  return dayjs(orderedDates[0].end as string);
};

export const is2038Problem = (date: Dayjs) =>
  date.isSame("2038-01-19T03:14:07.000Z");

export const getTimeFromNow = (
  d: Dayjs
): { unit: "day" | "month" | "year" | "never"; number: number } => {
  if (is2038Problem(d)) {
    return {
      unit: "never",
      number: -1,
    };
  }

  const now = dayjs();
  const yearsFromNow = d.diff(now, "years");
  if (yearsFromNow > 0) {
    return {
      unit: "year",
      number: yearsFromNow,
    };
  }

  const monthsFromNow = d.diff(now, "months");
  if (monthsFromNow > 0) {
    return {
      unit: "month",
      number: monthsFromNow,
    };
  }

  const daysFromNow = d.diff(now, "days");
  return {
    unit: "day",
    number: daysFromNow,
  };
};

export const isSkylarkUid = (uid: string) => {
  // Regex for a ULID
  // eslint-disable-next-line prefer-regex-literals
  const regex = new RegExp("[0-7][0-9A-HJKMNP-TV-Z]{25}");
  return regex.test(uid);
};
