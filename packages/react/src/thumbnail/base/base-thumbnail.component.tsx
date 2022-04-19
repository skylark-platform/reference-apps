import Link from "next/link";
import React from "react";
import { MdCircle, MdPlayArrow } from "react-icons/md";
import { H4 } from "../../typography";

export type ThumbnailContentLocation = "inside" | "below";

export interface ThumbnailProps {
  title: string;
  href: string;
  backgroundImage: string;
  subtitle?: string;
  playButton?: boolean;
  callToAction?: {
    text: string;
    display?: "always" | "hover";
  };
  tags?: string[];
  releaseDate?: string;
  duration?: string;
}

export interface BaseThumbnailProps extends ThumbnailProps {
  contentLocation: ThumbnailContentLocation;
}

/**
 * Types of Thumbnail (<Thumbnail type="movie" contentPlacement="inside || below" />)
 * - MovieThumbnail with content inside
 * - MovieThumbnail with content outside
 * - EpisodeThumbnail (with and without release date / available until) - episode number, description, duration (shown as call to action on hover)
 * - CollectionThumbnail (with tags)
 *
 * Shared components
 * - ThumbnailBase (background with tint) (aspect ratio as prop)
 *   - Also includes Play button + call to action (hide on collection) aligned to bottom unless children are provided
 * - Tags (Movie + Collection)
 *
 * Shared props
 * - Title
 * - show playButton
 * - show callToAction
 */

export const ThumbnailList: React.FC<{ contents: (string | undefined)[] }> = ({
  contents,
}) => (
  <div className="flex flex-row text-gray-400 items-center my-0.5">
    {contents
      .filter((el) => !!el)
      .map((text, index) => (
        <>
          {index !== 0 && <MdCircle className="mx-2 h-1 w-1 text-gray-400" />}
          <p
            className={`
            ${index === 0 ? "text-white" : "text-gray-400"}
            text-xs md:text-sm
            transition-colors group-hover:text-white
          `}
          >
            {text}
          </p>
        </>
      ))}
  </div>
);

export const BaseThumbnail: React.FC<BaseThumbnailProps> = ({
  href,
  backgroundImage,
  contentLocation = "inside",
  callToAction,
  title,
  subtitle,
  tags = [],
  duration,
  children,
}) => (
  <Link href={href}>
    <a className="group">
      {/* BaseComponent start */}
      <div
        // scale-[1.0001] stops a rough animation on a scale transition
        className={`
          z-30 block aspect-video scale-[1.0001] rounded-sm bg-cover bg-center bg-no-repeat
          transition-all hover:z-40 hover:scale-[1.02] md:hover:scale-105 w-full
        `}
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div
          className={`
        ${contentLocation === "below" ? "justify-end" : "justify-between"}
          flex h-full w-full flex-col rounded-sm relative
          bg-black/[.3] p-4 font-display text-white transition-all hover:bg-purple-500/[.85]
        `}
        >
          {duration && (
            <div className="top-3 right-3 absolute text-xs font-light bg-gray-900 py-0.5 px-2 rounded-xl group-hover:opacity-0">
              {duration}
            </div>
          )}
          <div className="flex flex-row items-center gap-2 lg:gap-4 font-light">
            <div className="inline-block w-auto rounded-full bg-gray-600/[.65] p-2 group-hover:bg-black/[.3]">
              <MdPlayArrow className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            {callToAction && (
              <p
                className={`transition-opacity font-medium ${
                  callToAction?.display === "always"
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {callToAction.text}
              </p>
            )}
          </div>
          {contentLocation === "inside" && (
            <div>
              <H4 className="text-white font-normal mb-0.5">{title}</H4>
              <ThumbnailList
                contents={[subtitle, ...(tags && tags.length > 0 ? tags : [])]}
              />
            </div>
          )}
        </div>
      </div>
      {/* BaseComponent end */}
      {contentLocation === "below" && children}
    </a>
  </Link>
);

export default BaseThumbnail;
