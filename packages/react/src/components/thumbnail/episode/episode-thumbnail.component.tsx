import React from "react";
import { List } from "../../list";
import {
  MediaThumbnail,
  ThumbnailProps,
} from "../base/base-thumbnail.component";

export interface EpisodeThumbnailProps extends ThumbnailProps {
  description: string;
  number?: number;
}

export const EpisodeThumbnail: React.FC<EpisodeThumbnailProps> = (props) => {
  const { title, number, description, duration, releaseDate, callToAction } =
    props;
  return (
    <MediaThumbnail
      {...props}
      callToAction={{
        text: `${duration || ""}`,
        display: "hover",
        ...callToAction,
      }}
      contentLocation="below"
    >
      <p className="font-lighter mb-1 mt-2 line-clamp-1 text-xs text-white sm:text-sm md:line-clamp-1 md:text-base">
        {number && <span className="mr-0.5">{`${number}.`}</span>}
        {title}
      </p>
      <p className="mb-3 mt-0.5 line-clamp-4 text-xs text-gray-400 md:text-sm">
        {description}
      </p>
      <List contents={[releaseDate]} highlightFirst />
    </MediaThumbnail>
  );
};
