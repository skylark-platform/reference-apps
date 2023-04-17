import { hasProperty } from "@skylark-reference-apps/lib";
import { EpisodeThumbnail, Skeleton } from "@skylark-reference-apps/react";
import { useInView } from "react-intersection-observer";
import { GET_BRAND_THUMBNAIL, GET_EPISODE_THUMBNAIL, GET_MOVIE_THUMBNAIL, GET_SET_THUMBNAIL } from "../graphql/queries";
import { GET_SEASON_THUMBNAIL } from "../graphql/queries/getSeason";
import { useObject } from "../hooks/useObject";
import { convertGraphQLSetType, convertTypenameToEntertainmentType, getGraphQLImageSrc } from "../lib/utils";
import { Entertainment, ImageType, ObjectTypes } from "../types";

export type ThumbnailVariant = "landscape" | "landscape-description" | "landscape-inside" | "portrait"

interface ThumbnailProps {
  uid: string
  objectType: ObjectTypes;
  variant: ThumbnailVariant
}

const getThumbnailQuery = (objectType: ObjectTypes) => {
  if(objectType === ObjectTypes.Episode) {
    return GET_EPISODE_THUMBNAIL;
  }

  if(objectType === ObjectTypes.Movie) {
    return GET_MOVIE_THUMBNAIL;
  }

  if(objectType === ObjectTypes.Brand) {
    return GET_BRAND_THUMBNAIL;
  }

  if(objectType === ObjectTypes.Season) {
    return GET_SEASON_THUMBNAIL;
  }

  if(objectType === ObjectTypes.SkylarkSet) {
    return GET_SET_THUMBNAIL;
  }

  return "";
}

export const Thumbnail = ({ uid, objectType, variant }: ThumbnailProps) => {

  const { ref, inView } = useInView({ triggerOnce: true });

  const query = getThumbnailQuery(objectType);

  const { data, isLoading } = useObject<Entertainment>(query, uid, !inView);

  const parsedType = data?.__typename === "SkylarkSet"
      ? convertGraphQLSetType(data?.type || "")
      : convertTypenameToEntertainmentType(data?.__typename);

return <div ref={ref}>
      {isLoading && !data && <Skeleton isPortrait={variant === "portrait"} show />}
      {data && (
        <EpisodeThumbnail
          backgroundImage={getGraphQLImageSrc(data?.images, ImageType.Thumbnail)}
          contentLocation="below"
          description={data?.synopsis_short || data?.synopsis || ""}
          href={`/${parsedType}/${uid}`}
          key={uid}
          number={data && hasProperty(data, "episode_number") ? (data.episode_number as number) : undefined}
          title={data?.title_short || data?.title || ""}
        />
      )}
    </div>
}
