import Link from "next/link";
import React from "react";
import { MdPlayArrow } from "react-icons/md";
import {
  ThumbnailContent,
  ThumbnailContentProps,
} from "./thumbnail-info.component";

export type ThumbnailContentLocation = "inside" | "below";

export interface ThumbnailProps extends ThumbnailContentProps {
  id: string;
  href: string;
  backgroundImage: string;
  width?: string;
  contentLocation?: ThumbnailContentLocation;
  callToAction?: string;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  href,
  backgroundImage,
  width,
  contentLocation = "inside",
  callToAction,
  ...thumbnailContentProps
}) => (
  <Link href={href}>
    <a>
      <div
        // scale-[1.0001] stops a rough animation on a scale transition
        className={`
          group z-30 block aspect-video scale-[1.0001] rounded-sm bg-contain bg-center bg-no-repeat
          transition-all hover:z-40 hover:scale-[1.02] md:hover:scale-105
          ${width || "w-full"}
        `}
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div
          className={`
        ${contentLocation === "below" ? "justify-end" : "justify-between"}
          flex h-full w-full flex-col rounded-sm
          bg-black/[.3] p-4 font-display text-white transition-all hover:bg-purple-500/[.85]
        `}
        >
          <div className="flex flex-row items-center gap-2 lg:gap-4 font-light">
            <div className="inline-block w-auto rounded-full bg-gray-600/[.65] p-2 group-hover:bg-black/[.3]">
              <MdPlayArrow className="h-6 w-6" />
            </div>
            {callToAction && <p className="">{callToAction}</p>}
          </div>
          {contentLocation === "inside" && (
            <div>
              <ThumbnailContent thinText {...thumbnailContentProps} />
            </div>
          )}
        </div>
      </div>
      {contentLocation === "below" && (
        <div className="py-4">
          <ThumbnailContent {...thumbnailContentProps} />
        </div>
      )}
    </a>
  </Link>
);

export default Thumbnail;
