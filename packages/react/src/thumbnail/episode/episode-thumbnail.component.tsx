import React from "react";
import {
  MediaThumbnail,
  ThumbnailList,
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
      <h4 className="text-white mt-2 mb-0.5 font-lighter text-sm md:text-base line-clamp-1">
        {`${number ? `${number}. ` : ""}${title}`}
      </h4>
      <p className="text-gray-400 text-xs md:text-sm mt-0.5 mb-3 line-clamp-3 md:line-clamp-4">
        {description}
      </p>
      <ThumbnailList contents={[releaseDate]} highlightFirst />
    </MediaThumbnail>
  );
};
