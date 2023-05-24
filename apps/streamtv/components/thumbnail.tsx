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
  GET_BRAND_THUMBNAIL,
  GET_EPISODE_THUMBNAIL,
  GET_MOVIE_THUMBNAIL,
  GET_SET_THUMBNAIL,
} from "../graphql/queries";
import { GET_SEASON_THUMBNAIL } from "../graphql/queries/getSeason";
import { useObject } from "../hooks/useObject";
import {
  convertGraphQLSetType,
  convertTypenameToObjectType,
  getGraphQLImageSrc,
} from "../lib/utils";
import { Entertainment, ImageType, ObjectTypes } from "../types";

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
}

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

  if (objectType === ObjectTypes.SkylarkSet) {
    return GET_SET_THUMBNAIL;
  }

  return "";
};

export const Thumbnail = ({ uid, objectType, variant }: ThumbnailProps) => {
  const { ref, inView } = useInView();

  const query = getThumbnailQuery(objectType);

  const { data, isLoading } = useObject<Entertainment>(query, uid, {
    disabled: !inView,
  });

  const parsedType =
    data?.__typename === "SkylarkSet"
      ? convertGraphQLSetType(data?.type || "")
      : convertTypenameToObjectType(data?.__typename);

  const href = parsedType === "page" ? uid : `/${parsedType}/${uid}`;

  const thumbnailImage = getGraphQLImageSrc(data?.images, ImageType.Thumbnail);

  return (
    <div ref={ref}>
      {isLoading && !data && (
        <Skeleton isPortrait={variant === "portrait"} show />
      )}
      {data && (
        <>
          {variant === "landscape-synopsis" && (
            <EpisodeThumbnail
              backgroundImage={thumbnailImage}
              contentLocation="below"
              description={data?.synopsis_short || data?.synopsis || ""}
              href={href}
              key={uid}
              number={
                data && hasProperty(data, "episode_number")
                  ? (data.episode_number as number)
                  : undefined
              }
              title={data?.title_short || data?.title || ""}
            />
          )}

          {variant === "landscape-movie" && (
            <MovieThumbnail
              backgroundImage={thumbnailImage}
              contentLocation="below"
              href={href}
              key={uid}
              releaseDate={
                data && hasProperty(data, "release_date")
                  ? formatYear(data.release_date as string)
                  : undefined
              }
              title={data?.title_short || data?.title || ""}
            />
          )}

          {variant === "landscape-inside" && (
            <MovieThumbnail
              backgroundImage={thumbnailImage}
              contentLocation="inside"
              href={href}
              key={uid}
              releaseDate={
                data && hasProperty(data, "release_date")
                  ? formatYear(data.release_date as string)
                  : undefined
              }
              title={data?.title_short || data?.title || ""}
            />
          )}

          {variant === "portrait" && (
            <CollectionThumbnail
              backgroundImage={thumbnailImage}
              href={href}
              key={uid}
              title={data?.title_short || data?.title || ""}
            />
          )}

          {variant === "landscape" && (
            <StandardThumbnail
              backgroundImage={thumbnailImage}
              contentLocation="below"
              href={href}
              key={uid}
              title={data?.title_short || data?.title || ""}
            />
          )}
        </>
      )}
    </div>
  );
};
