import React from "react";
import Link from "next/link";
import {
  BaseThumbnail,
  ThumbnailProps,
} from "../base/base-thumbnail.component";

export interface ArticleThumbnailProps extends ThumbnailProps {
  description: string;
}

export const ArticleThumbnail: React.FC<ArticleThumbnailProps> = (props) => {
  const { title, description, href } = props;
  return (
    <Link className="group" href={href}>
      <BaseThumbnail {...props}>
        <div className="relative flex h-full w-full flex-col items-center justify-center text-center"></div>
      </BaseThumbnail>
      <p className="line-clamp-3 text-sm font-medium text-white md:text-base">
        {title}
      </p>
      {description && (
        <p className="mt-2 line-clamp-4 text-xs text-gray-400 md:text-sm">
          {description}
        </p>
      )}
    </Link>
  );
};
