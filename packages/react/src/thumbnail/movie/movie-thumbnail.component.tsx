import React from "react";
import { List } from "../../list";

import {
  MediaThumbnail,
  ThumbnailContentLocation,
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
      <p className="mt-2 mb-0.5 text-[16px] font-normal leading-[20px] text-white md:text-[18px] md:leading-[24px]">
        {title}
      </p>
      <List
        contents={[subtitle, ...(tags && tags.length > 0 ? tags : [])]}
        highlightFirst
      />
      <List contents={[duration, releaseDate]} highlightFirst />
    </MediaThumbnail>
  );
};
