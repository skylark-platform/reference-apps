import Link from "next/link";
import React from "react";
import { MdPlayArrow, MdCircle } from "react-icons/md";
import { H4 } from "../typography/heading/heading.component";

export interface ThumbnailProps {
  id: string;
  href: string;
  title: string;
  backgroundImage: string;
  subtitle?: string;
  tags?: string[];
  width?: string;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  href,
  title,
  subtitle,
  tags,
  backgroundImage,
  width,
}) => (
  <Link href={href}>
    <a
      // scale-[1.0001] stops a rough animation on a scale transition
      className={`
        group z-30 block aspect-video scale-[1.0001] rounded-sm bg-contain bg-center bg-no-repeat
        transition-all hover:z-40 hover:scale-[1.02] md:hover:scale-105
        ${width || "w-full"}
      `}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="flex h-full w-full flex-col justify-between rounded-sm bg-black/[.3] p-4 font-display text-white transition-all hover:bg-purple-500/[.85]">
        <div>
          <div className="inline-block w-auto rounded-full bg-gray-600/[.65] p-2 group-hover:bg-black/[.3]">
            <MdPlayArrow className="h-6 w-6" />
          </div>
        </div>
        <div>
          <H4 className="text-white">{title}</H4>
          <div className="flex flex-row items-center">
            <p className="text-sm font-thin">{subtitle}</p>
            {tags &&
              tags.map((tag) => (
                <>
                  <MdCircle className="mx-2 h-1 w-1 text-gray-400" />
                  <p
                    className="text-sm font-thin text-gray-400 transition-colors group-hover:text-white"
                    key={tag}
                  >
                    {tag}
                  </p>
                </>
              ))}
          </div>
        </div>
      </div>
    </a>
  </Link>
);

export default Thumbnail;
