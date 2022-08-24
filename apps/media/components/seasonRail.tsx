import { FC } from "react";

import { Rail } from "@skylark-reference-apps/react";
import {
  Episode,
  getTitleByOrder,
  AllEntertainment,
} from "@skylark-reference-apps/lib";

// import { DataFetcher } from "./dataFetcher";

interface SeasonRailProps {
  season: AllEntertainment;
  header?: string;
}

// const sortEpisodesByNumber = (a: Episode, b: Episode) =>
//   (a.number || 0) > (b.number || 0) ? 1 : -1;

export const SeasonRail: FC<SeasonRailProps> = ({ season, header }) => {
  const episodes = (season.items?.objects as Episode[]) ?? [];
  console.log(season);
  return (
    <Rail
      displayCount
      header={
        header ||
        getTitleByOrder(
          season?.title,
          ["medium", "short", "long"],
          season.objectTitle
        )
      }
    >
      {console.log("episodes", episodes)}
      <div>{test}</div>
      {/* {episodes.sort(sortEpisodesByNumber).map(({ self, slug }) => (
        <div key={self}>{`${self}-${slug}`}</div>
        // <DataFetcher key={index} self={self} slug={slug}>
        //   {(episode: Episode) => (
        //     <EpisodeThumbnail
        //       backgroundImage={getImageSrc(
        //         episode.images,
        //         "Thumbnail",
        //         "384x216"
        //       )}
        //       contentLocation="below"
        //       description={getSynopsisByOrder(
        //         episode?.synopsis,
        //         ["short", "medium", "long"]
        //       )}
        //       href={`/episode/${episode.slug}`}
        //       key={episode.objectTitle || episode.uid || episode.slug}
        //       number={episode.number || 0}
        //       title={getTitleByOrder(
        //         episode?.title,
        //         ["short", "medium", "long"],
        //         episode.objectTitle
        //       )}
        //     />
        //   )}
        // </DataFetcher>
      ))}  */}
    </Rail>
  );
};
