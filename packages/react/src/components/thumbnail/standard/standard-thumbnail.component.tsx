import React from "react";
import { List } from "../../list";
import { H4 } from "../../typography";
import {
  MediaThumbnail,
  ThumbnailContentLocation,
  ThumbnailProps,
} from "../base/base-thumbnail.component";

export interface StandardThumbnailProps extends ThumbnailProps {
  description?: string;
  subtitle?: string;
  contentLocation?: ThumbnailContentLocation;
}

export const StandardThumbnail: React.FC<StandardThumbnailProps> = (props) => {
  const {
    title,
    subtitle,
    tags = [],
    description,
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
      <H4 className="mb-0.5 mt-2 text-white">{title}</H4>
      {description && (
        <p className="mb-3 mt-0.5 text-xs text-gray-400 line-clamp-4 md:text-sm">
          {description}
        </p>
      )}
      <List
        contents={[subtitle, ...(tags && tags.length > 0 ? tags : [])]}
        highlightFirst
      />
      <List contents={[duration, releaseDate]} highlightFirst />
    </MediaThumbnail>
  );
};
