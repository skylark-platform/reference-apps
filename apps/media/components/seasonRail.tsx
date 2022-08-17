import { FC } from "react";

import { EpisodeThumbnail, Rail } from "@skylark-reference-apps/react";
import {
  Episode,
  getImageSrc,
  AllEntertainment,
} from "@skylark-reference-apps/lib";

import { Card } from "./card";

export const SeasonRail: FC<{ item: AllEntertainment }> = ({ item }) => {
  const items = item?.items?.isExpanded ? item.items.objects : [];

  return (
    <Rail displayCount header={item.title?.medium || item.title?.short}>
      {(items as Episode[])
        .sort((a: Episode, b: Episode) =>
          (a.number || 0) > (b.number || 0) ? 1 : -1
        )
        .map(({ self }, index) => (
          <Card key={index} self={self}>
            {(episode: Episode) => (
              <EpisodeThumbnail
                backgroundImage={getImageSrc(
                  episode.images,
                  "Thumbnail",
                  "384x216"
                )}
                contentLocation="below"
                description={
                  episode.synopsis?.short ||
                  episode.synopsis?.medium ||
                  episode.synopsis?.long ||
                  ""
                }
                href={
                  episode.type && episode.slug
                    ? `/${episode.type}/${episode.slug}`
                    : ""
                }
                key={episode.objectTitle || episode.uid || episode.slug}
                number={episode.number || 0}
                releaseDate={episode.releaseDate}
                title={episode.title?.short || ""}
              />
            )}
          </Card>
        ))}
    </Rail>
  );
};
