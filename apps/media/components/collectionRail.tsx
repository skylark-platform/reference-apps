import { FC } from "react";

import { CollectionThumbnail, Rail } from "@skylark-reference-apps/react";
import {
  getImageSrc,
  getTitleByOrder,
  AllEntertainment,
} from "@skylark-reference-apps/lib";

import { DataFetcher } from "./dataFetcher";

export const CollectionRail: FC<{ section: AllEntertainment }> = ({
  section,
}) => {
  const items = section.items?.objects ?? [];

  return (
    <Rail displayCount header={section.title?.medium || section.title?.short}>
      {items.map(({ self }, index) => (
        <DataFetcher key={index} self={self}>
          {(item: AllEntertainment) => (
            <CollectionThumbnail
              backgroundImage={getImageSrc(item.images, "Thumbnail", "350x350")}
              contentLocation="below"
              href={item.type && item.slug ? `/${item.type}/${item.slug}` : ""}
              key={item.objectTitle || item.uid || item.slug}
              title={getTitleByOrder(item.title, ["short", "medium"])}
            />
          )}
        </DataFetcher>
      ))}
    </Rail>
  );
};
