import { FC } from "react";

import { EpisodeThumbnail, Rail } from "@skylark-reference-apps/react";
import {
  Episode,
  getImageSrc,
  getTitleByOrder,
  getSynopsisByOrder,
  AllEntertainment,
  TitleTypes,
  SynopsisTypes,
} from "@skylark-reference-apps/lib";

import { Card } from "./card";

interface SeasonRailProps {
  episodeDescription: SynopsisTypes[];
  episodeTitle: TitleTypes[];
  item: AllEntertainment;
  header?: string;
  thumbnailSize?: string;
}

const sortEpisodesByNumber = (a: Episode, b: Episode) =>
  (a.number || 0) > (b.number || 0) ? 1 : -1;

export const SeasonRail: FC<SeasonRailProps> = ({
  episodeTitle,
  episodeDescription,
  item,
  header = item.title?.medium || item.title?.short,
  thumbnailSize = "384x216",
}) => {
  const items = item?.items?.isExpanded ? item.items.objects : [];

  return (
    <Rail displayCount header={header}>
      {(items as Episode[])
        .sort(sortEpisodesByNumber)
        .map(({ self }, index) => (
          <Card key={index} self={self}>
            {(episode: Episode) => (
              <EpisodeThumbnail
                backgroundImage={getImageSrc(
                  episode.images,
                  "Thumbnail",
                  thumbnailSize
                )}
                contentLocation="below"
                description={getSynopsisByOrder(
                  episode?.synopsis,
                  episodeDescription
                )}
                href={`/episode/${episode.slug}`}
                key={episode.objectTitle || episode.uid || episode.slug}
                number={episode.number || 0}
                // releaseDate={episode.releaseDate}
                title={getTitleByOrder(
                  episode?.title,
                  episodeTitle,
                  episode.objectTitle
                )}
              />
            )}
          </Card>
        ))}
    </Rail>
  );
};
