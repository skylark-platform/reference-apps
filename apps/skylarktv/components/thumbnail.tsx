import {
  EntertainmentType,
  SetTypes,
  formatYear,
  getTitleByOrder,
  hasProperty,
} from "@skylark-reference-apps/lib";
import { useInView } from "react-intersection-observer";
import { ForwardedRef, forwardRef } from "react";
import {
  GET_BRAND_THUMBNAIL,
  GET_ARTICLE_THUMBNAIL,
  GET_EPISODE_THUMBNAIL,
  GET_LIVE_STREAM_THUMBNAIL,
  GET_MOVIE_THUMBNAIL,
  GET_PERSON_THUMBNAIL,
  GET_SET_THUMBNAIL,
  GET_EPISODE_THUMBNAIL_WITH_ADDITIONAL_RELATIONSHIPS,
} from "../graphql/queries";
import { GET_SEASON_THUMBNAIL } from "../graphql/queries/getSeason";
import {
  convertGraphQLSetType,
  convertTypenameToObjectType,
  getGraphQLImageSrc,
} from "../lib/utils";
import {
  Article,
  BrandListing,
  Entertainment,
  ImageType,
  ObjectTypes,
  Person,
  SeasonListing,
  SkylarkSet,
  SkylarkTVSupportedImageType,
  SkylarkTVSupportedSetType,
} from "../types";
import { useObject } from "../hooks/useObject";
import { Skeleton } from "./generic/skeleton";
import {
  EpisodeThumbnail,
  MovieThumbnail,
  CollectionThumbnail,
  StandardThumbnail,
  ArticleThumbnail,
} from "./generic/thumbnail";

export type ThumbnailVariant =
  | "landscape"
  | "landscape-synopsis"
  | "landscape-movie"
  | "landscape-inside"
  | "portrait"
  | "article"
  | "credit";

interface ThumbnailProps {
  uid: string;
  externalId?: string | null;
  slug?: string | null;
  variant: ThumbnailVariant;
  preferredImageType?: SkylarkTVSupportedImageType;
  data?: Entertainment | Person | Article;
  isLoading?: boolean;
}

type ThumbnailWithSelfFetchProps = Omit<
  ThumbnailProps,
  "data" | "isLoading"
> & {
  initialData?: ThumbnailProps["data"];
  fetchAdditionalRelationships?: boolean;
  objectType: ObjectTypes;
};

const dataIsPerson = (
  data: Entertainment | Person | undefined,
): data is Person => data?.__typename === ObjectTypes.Person;

const dataIsArticle = (
  data: Entertainment | Person | Article | undefined,
): data is Article => data?.__typename === ObjectTypes.Article;

const getTitleAndDescription = (
  data?: Entertainment | Person | Article,
): { title: string; description: string } => {
  if (!data) {
    return {
      title: "",
      description: "",
    };
  }

  if (dataIsArticle(data)) {
    return {
      title: data.title || "",
      description: data.description || "",
    };
  }

  if (dataIsPerson(data)) {
    return {
      title: data.name || "",
      description: data.bio_short || "",
    };
  }

  return {
    title: data.title_short || data.title || "",
    description: data.synopsis_short || data.synopsis || "",
  };
};

const generateHref = (
  parsedType: SetTypes | EntertainmentType | "person",
  uid: ThumbnailProps["uid"],
  slug?: ThumbnailProps["slug"],
) => {
  if (parsedType === "page") {
    return uid;
  }

  const base = `/${parsedType}/${uid}`;

  if (parsedType === "episode" && slug) {
    return `${base}/${slug}`;
  }

  return base;
};

export const getThumbnailVariantFromSetType = (
  setType: SkylarkSet["type"],
): ThumbnailVariant => {
  if (setType === SkylarkTVSupportedSetType.RailInset) {
    return "landscape-inside";
  }

  if (setType === SkylarkTVSupportedSetType.RailWithSynopsis) {
    return "landscape-synopsis";
  }

  if (setType === SkylarkTVSupportedSetType.RailMovie) {
    return "landscape-movie";
  }

  if (
    setType === SkylarkTVSupportedSetType.RailPortrait ||
    setType === SkylarkTVSupportedSetType.Collection ||
    setType === SkylarkTVSupportedSetType.GridPortrait
  ) {
    return "portrait";
  }

  return "landscape";
};

const getThumbnailQuery = (
  objectType: ObjectTypes,
  withAdditionalRelationships: boolean,
) => {
  if (objectType === ObjectTypes.Episode) {
    if (withAdditionalRelationships) {
      return GET_EPISODE_THUMBNAIL_WITH_ADDITIONAL_RELATIONSHIPS;
    }
    return GET_EPISODE_THUMBNAIL;
  }

  if (objectType === ObjectTypes.Movie) {
    return GET_MOVIE_THUMBNAIL;
  }

  if (objectType === ObjectTypes.Brand) {
    return GET_BRAND_THUMBNAIL;
  }

  if (objectType === ObjectTypes.Season) {
    return GET_SEASON_THUMBNAIL;
  }

  if (objectType === ObjectTypes.Person) {
    return GET_PERSON_THUMBNAIL;
  }

  if (objectType === ObjectTypes.Article) {
    return GET_ARTICLE_THUMBNAIL;
  }

  if (objectType === ObjectTypes.LiveStream) {
    return GET_LIVE_STREAM_THUMBNAIL;
  }

  if (objectType === ObjectTypes.SkylarkSet) {
    return GET_SET_THUMBNAIL;
  }

  return "";
};

const getStatusTag = (tags: Entertainment["tags"]): string | undefined => {
  const statusTag = tags?.objects?.find(
    (tag) => tag?.type === "SCHEDULE_STATUS",
  );

  const name = statusTag?.name;

  return typeof name === "string" ? name : undefined;
};

const getBrandAndSeasonFromObject = (
  object: Entertainment | Person | Article | undefined,
) => {
  const season =
    (object &&
      hasProperty<Entertainment | Person | Article, "seasons", SeasonListing>(
        object,
        "seasons",
      ) &&
      object.seasons.objects?.[0]) ||
    null;

  const brandsFromSeason =
    (season &&
      hasProperty<Entertainment | Person | Article, "brands", BrandListing>(
        season,
        "brands",
      ) &&
      season.brands.objects) ||
    [];

  const brandsFromObject =
    (object &&
      hasProperty<Entertainment | Person | Article, "brands", BrandListing>(
        object,
        "brands",
      ) &&
      object.brands.objects) ||
    [];

  const brand = brandsFromObject?.[0] || brandsFromSeason?.[0] || null;

  return {
    season,
    brand,
  };
};

const ThumbnailComponent = (
  {
    uid,
    externalId,
    slug,
    variant,
    preferredImageType,
    data,
    isLoading,
  }: ThumbnailProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const parsedType =
    data?.__typename === "SkylarkSet"
      ? convertGraphQLSetType(data?.type || "")
      : convertTypenameToObjectType(data?.__typename);

  const href = generateHref(
    parsedType,
    parsedType === "page" ? externalId || uid : uid,
    slug,
  );

  const backgroundImage = getGraphQLImageSrc(
    data?.images,
    preferredImageType || ImageType.Thumbnail,
  );

  const { title, description } = getTitleAndDescription(data);

  const { brand, season } = getBrandAndSeasonFromObject(data);

  return (
    <div ref={ref}>
      {isLoading && <Skeleton isPortrait={variant === "portrait"} show />}
      {!isLoading && data && (
        <>
          {variant === "landscape-synopsis" && (
            <EpisodeThumbnail
              backgroundImage={backgroundImage}
              contentLocation="below"
              description={description}
              href={href}
              key={uid}
              number={
                data && hasProperty(data, "episode_number")
                  ? (data.episode_number as number)
                  : undefined
              }
              statusTag={getStatusTag(data.tags)}
              title={title}
            />
          )}

          {variant === "landscape-movie" && (
            <MovieThumbnail
              backgroundImage={backgroundImage}
              contentLocation="below"
              href={href}
              key={uid}
              releaseDate={
                data && hasProperty(data, "release_date")
                  ? formatYear(data.release_date as string)
                  : undefined
              }
              statusTag={getStatusTag(data.tags)}
              title={title}
            />
          )}

          {variant === "landscape-inside" && (
            <MovieThumbnail
              backgroundImage={backgroundImage}
              contentLocation="inside"
              href={href}
              key={uid}
              releaseDate={
                data && hasProperty(data, "release_date")
                  ? formatYear(data.release_date as string)
                  : undefined
              }
              statusTag={getStatusTag(data.tags)}
              title={title}
            />
          )}

          {variant === "portrait" && (
            <CollectionThumbnail
              backgroundImage={backgroundImage}
              href={href}
              key={uid}
              statusTag={getStatusTag(data.tags)}
              title={title}
            />
          )}

          {variant === "landscape" && (
            <StandardThumbnail
              backgroundImage={backgroundImage}
              contentLocation="below"
              href={href}
              key={uid}
              statusTag={getStatusTag(data.tags)}
              title={title}
            />
          )}

          {variant === "article" && (
            <ArticleThumbnail
              backgroundImage={backgroundImage}
              description={description}
              href={href}
              key={uid}
              statusTag={
                getStatusTag(data.tags) ||
                (hasProperty(data, "type") && (data.type as string)) ||
                undefined
              }
              title={title}
            />
          )}

          {variant === "credit" && (
            <EpisodeThumbnail
              backgroundImage={backgroundImage}
              brand={brand ? getTitleByOrder(brand) : undefined}
              contentLocation="below"
              description={description}
              href={href}
              key={uid}
              number={
                data && hasProperty(data, "episode_number") && season
                  ? `S${season.season_number}E${data.episode_number as number}`
                  : undefined
              }
              statusTag={getStatusTag(data.tags)}
              title={title}
            />
          )}
        </>
      )}
    </div>
  );
};

export const Thumbnail = forwardRef(ThumbnailComponent);

export const ThumbnailWithSelfFetch = ({
  objectType,
  uid,
  initialData,
  fetchAdditionalRelationships,
  ...props
}: ThumbnailWithSelfFetchProps) => {
  const { ref, inView } = useInView();

  const query = getThumbnailQuery(
    objectType,
    fetchAdditionalRelationships || false,
  );

  const { data, isLoading } = useObject<Entertainment | Person | Article>(
    query,
    uid,
    {
      disabled: !inView,
      initialData,
    },
  );

  return (
    <Thumbnail
      data={data}
      isLoading={isLoading}
      ref={ref}
      uid={uid}
      {...props}
    />
  );
};
