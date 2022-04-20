import React from "react";
import { H4 } from "../../typography";
import {
  MediaThumbnail,
  ThumbnailContentLocation,
  ThumbnailList,
  ThumbnailProps,
} from "../base/base-thumbnail.component";

export interface MovieThumbnailProps extends ThumbnailProps {
  subtitle?: string;
  contentLocation?: ThumbnailContentLocation;
}

export const MovieThumbnail: React.FC<MovieThumbnailProps> = (props) => {
  const {
    title,
    subtitle,
    tags = [],
    duration,
    releaseDate,
    contentLocation,
  } = props;
  return (
    <MediaThumbnail
      {...props}
      contentLocation={contentLocation || "inside"}
      duration={undefined}
    >
      <H4 className="mt-2 mb-0.5 text-white">{title}</H4>
      <ThumbnailList
        contents={[subtitle, ...(tags && tags.length > 0 ? tags : [])]}
        highlightFirst
      />
      <ThumbnailList contents={[duration, releaseDate]} highlightFirst />
    </MediaThumbnail>
  );
};
