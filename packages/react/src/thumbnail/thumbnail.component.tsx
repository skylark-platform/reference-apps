import Link from "next/link";
import React from "react";
import { MdPlayArrow, MdCircle } from "react-icons/md";
import { H4 } from "../typography/heading/heading.component";

export interface ThumbnailProps {
  href: string
  title: string
  backgroundImage: string
  subtitle?: string
  tags?: string[]
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  href,
  title,
  subtitle,
  tags,
  backgroundImage
}) => (
    <Link href={href}>
      <a
        className={`aspect-video w-full bg-center block bg-contain group`}
        style={{ backgroundImage: `url('${backgroundImage}')`}}
      >
        <div className="bg-black/[.3] flex justify-between flex-col p-4 text-white font-display h-full w-full hover:bg-purple-500/[.85] transition-all">
          <div>
            <div className="p-2 bg-gray-600/[.65] w-auto inline-block rounded-full group-hover:bg-black/[.3]">
              <MdPlayArrow className="w-6 h-6" />
            </div>
          </div>
          <div>
            <H4 className="text-white">{title}</H4>
            <div className="flex flex-row items-center">
              <p className="font-thin text-sm">{subtitle}</p>
              {tags && tags.map((tag) => (
                <>
                  <MdCircle className="h-1 w-1 mx-2 text-gray-400" />
                  <p
                    className="font-thin text-sm text-gray-400 group-hover:text-white transition-colors"
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
