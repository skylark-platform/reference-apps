import { formatYear, hasProperty } from "@skylark-reference-apps/lib";
import {
  CollectionThumbnail,
  EpisodeThumbnail,
  MovieThumbnail,
  Skeleton,
  StandardThumbnail,
} from "@skylark-reference-apps/react";
import { useInView } from "react-intersection-observer";
import {
  GET_ARTICLE_THUMBNAIL,
  GET_BRAND_THUMBNAIL,
  GET_EPISODE_THUMBNAIL,
  GET_MOVIE_THUMBNAIL,
  GET_PERSON_THUMBNAIL,
  GET_SET_THUMBNAIL,
} from "../graphql/queries";
import { GET_SEASON_THUMBNAIL } from "../graphql/queries/getSeason";
import { useObject } from "../hooks/useObject";
import {
  convertGraphQLSetType,
  convertTypenameToObjectType,
  getGraphQLImageSrc,
} from "../lib/utils";
import {
  Article,
  Entertainment,
  ImageType,
  ObjectTypes,
  Person,
  SkylarkSet,
  StreamTVSupportedImageType,
  StreamTVSupportedSetType,
} from "../types";

export type ThumbnailVariant =
  | "landscape"
  | "landscape-synopsis"
  | "landscape-movie"
  | "landscape-inside"
  | "portrait";

interface ThumbnailProps {
  uid: string;
  objectType: ObjectTypes;
  variant: ThumbnailVariant;
  preferredImageType?: StreamTVSupportedImageType;
}

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
    title: data.title_short || data.title_medium || data.title_long || "",
    description:
      data.synopsis_short || data.synopsis_medium || data.title_long || "",
  };
};

export const getThumbnailVariantFromSetType = (
  setType: SkylarkSet["type"],
): ThumbnailVariant => {
  if (setType === StreamTVSupportedSetType.RailInset) {
    return "landscape-inside";
  }

  if (setType === StreamTVSupportedSetType.RailWithSynopsis) {
    return "landscape-synopsis";
  }

  if (setType === StreamTVSupportedSetType.RailMovie) {
    return "landscape-movie";
  }

  if (
    setType === StreamTVSupportedSetType.RailPortrait ||
    setType === StreamTVSupportedSetType.Collection ||
    setType === StreamTVSupportedSetType.GridPortrait
  ) {
    return "portrait";
  }

  return "landscape";
};

const getThumbnailQuery = (objectType: ObjectTypes) => {
  if (objectType === ObjectTypes.Episode) {
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

  if (objectType === ObjectTypes.CountrylineSet) {
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

export const Thumbnail = ({
  uid,
  objectType,
  variant,
  preferredImageType,
}: ThumbnailProps) => {
  const { ref, inView } = useInView();

  const query = getThumbnailQuery(objectType);

  const { data, isLoading } = useObject<Entertainment | Person | Article>(
    query,
    uid,
    {
      disabled: !inView,
    },
  );

  const parsedType =
    data?.__typename === "CountrylineSet"
      ? convertGraphQLSetType(data?.type || "")
      : convertTypenameToObjectType(data?.__typename);

  const href = parsedType === "page" ? uid : `/${parsedType}/${uid}`;

  const backgroundImage = getGraphQLImageSrc(
    data?.images,
    preferredImageType || ImageType.Thumbnail,
  );

  const { title, description } = getTitleAndDescription(data);

  return (
    <div ref={ref}>
      {isLoading && !data && (
        <Skeleton isPortrait={variant === "portrait"} show />
      )}
      {data && (
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
        </>
      )}
    </div>
  );
};
