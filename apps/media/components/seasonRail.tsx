import { FC } from "react";

import { EpisodeThumbnail, Rail } from "@skylark-reference-apps/react";
import {
  Episode,
  getImageSrc,
  getTitleByOrder,
  getSynopsisByOrder,
  AllEntertainment,
} from "@skylark-reference-apps/lib";

import { DataFetcher } from "./dataFetcher";

interface SeasonRailProps {
  item: AllEntertainment;
  header?: string;
}

export const SeasonRail: FC<SeasonRailProps> = ({
  item,
  header = item.title?.medium || item.title?.short,
}) => {
  const items = (item?.items?.objects as Episode[]) ?? [];

  return (
    <Rail displayCount header={header}>
      {items.map(({ self, slug }, index) => (
        <DataFetcher key={index} self={self} slug={slug}>
          {(episode: Episode) => (
            <EpisodeThumbnail
              backgroundImage={getImageSrc(
                episode?.images,
                "Thumbnail",
                "384x216"
              )}
              contentLocation="below"
              description={getSynopsisByOrder(episode?.synopsis, [
                "short",
                "medium",
                "long",
              ])}
              href={`/episode/${episode.slug}`}
              key={episode.objectTitle || episode.uid || episode.slug}
              number={episode.number || 0}
              title={getTitleByOrder(
                episode?.title,
                ["short", "medium"],
                episode.objectTitle
              )}
            />
          )}
        </DataFetcher>
      ))}
    </Rail>
  );
};
