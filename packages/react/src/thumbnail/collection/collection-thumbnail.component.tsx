import React from "react";
import { List } from "../../list";
import {
  BaseThumbnailWithLink,
  ThumbnailProps,
} from "../base/base-thumbnail.component";

export const CollectionThumbnail: React.FC<ThumbnailProps> = (props) => {
  const { title, subtitle, tags } = props;
  return (
    <BaseThumbnailWithLink large {...props} contentLocation="inside">
      <div className="relative flex h-full w-full flex-col items-center justify-center text-center">
        <p className="text-sm font-medium sm:text-lg md:text-3xl">{title}</p>
        {subtitle && <p className="text-3xl text-gray-400">{subtitle}</p>}
        {tags && (
          <div className="absolute bottom-0 hidden md:block">
            <List contents={tags} />
          </div>
        )}
      </div>
    </BaseThumbnailWithLink>
  );
};
