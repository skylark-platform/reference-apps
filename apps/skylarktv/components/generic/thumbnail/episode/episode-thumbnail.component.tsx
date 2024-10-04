import React from "react";
import clsx from "clsx";
import { List } from "../../list";
import {
  MediaThumbnail,
  ThumbnailProps,
} from "../base/base-thumbnail.component";

export interface EpisodeThumbnailProps extends ThumbnailProps {
  description: string;
  number?: number | string;
  brand?: string;
}

export const EpisodeThumbnail: React.FC<EpisodeThumbnailProps> = (props) => {
  const {
    title,
    number,
    description,
    duration,
    releaseDate,
    callToAction,
    brand,
  } = props;
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
      {brand && (
        <p className="font-lighter mt-2 line-clamp-1 text-xs text-gray-400 md:line-clamp-1 md:text-sm">
          {brand}
          {number && ` - ${number}`}
        </p>
      )}
      <p
        className={clsx(
          "font-lighter mb-1 line-clamp-1 text-xs text-white sm:text-sm md:line-clamp-1 md:text-base",
          !brand && "mt-2",
        )}
      >
        {number && !brand && <span className="mr-0.5">{`${number}.`}</span>}
        {title}
      </p>
      <p
        className={clsx(
          "mb-3 mt-0.5 text-xs text-gray-400 md:text-sm",
          brand ? "line-clamp-4" : "line-clamp-5",
        )}
      >
        {description}
      </p>
      <List contents={[releaseDate]} highlightFirst />
    </MediaThumbnail>
  );
};
