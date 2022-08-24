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
  thumbnailSize?: string;
}

const sortEpisodesByNumber = (a: Episode, b: Episode) =>
  (a?.number || 0) > (b?.number || 0) ? 1 : -1;

export const SeasonRail: FC<SeasonRailProps> = ({
  item,
  header = item.title?.medium || item.title?.short,
  thumbnailSize = "384x216",
}) => {
  const items = (item?.items?.objects as Episode[]) ?? [];

  return (
    <Rail displayCount header={header}>
      {items.sort(sortEpisodesByNumber).map(({ self, slug }, index) => (
        <DataFetcher key={index} self={self} slug={slug}>
          {(episode: Episode) => (
            <EpisodeThumbnail
              backgroundImage={getImageSrc(
                episode?.images,
                "Thumbnail",
                thumbnailSize
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
