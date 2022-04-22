import React from "react";
import { List } from "../../list";
import {
  MediaThumbnail,
  ThumbnailProps,
} from "../base/base-thumbnail.component";

export interface EpisodeThumbnailProps extends ThumbnailProps {
  description: string;
  number: number;
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
      <h4 className="font-lighter mt-2 mb-1 text-white line-clamp-1 md:line-clamp-1 text-xs sm:text-sm md:text-base">
        <span className="mr-0.5">{`${number}.`}</span>
        {title}
      </h4>
      <p className="mt-0.5 mb-3 text-xs text-gray-400 line-clamp-4 md:text-sm">
        {description}
      </p>
      <List contents={[releaseDate]} highlightFirst />
    </MediaThumbnail>
  );
};
