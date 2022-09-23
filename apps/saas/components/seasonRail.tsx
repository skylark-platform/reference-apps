import { FC } from "react";

import { EpisodeThumbnail, Rail } from "@skylark-reference-apps/react";
import {
  Episode,
  getImageSrc,
  getTitleByOrder,
  getSynopsisByOrder,
  Season,
} from "@skylark-reference-apps/lib";

import { DataFetcher } from "./dataFetcher";

interface SeasonRailProps {
  item: Season;
  header?: string;
}

const sortEpisodesByNumber = (a: Episode, b: Episode) =>
  (a?.number || 0) > (b?.number || 0) ? 1 : -1;

export const SeasonRail: FC<SeasonRailProps> = ({ item, header }) => {
  const episodes = (item?.items?.objects as Episode[]) ?? [];

  return (
    <Rail
      displayCount
      header={header || getTitleByOrder(item?.title, ["short", "medium"])}
    >
      {episodes.sort(sortEpisodesByNumber).map(({ self, slug }) => (
        <DataFetcher key={`episode-${slug}`} self={self} slug={slug}>
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
