import { FC } from "react";

import { MovieThumbnail, Rail } from "@skylark-reference-apps/react";
import { getImageSrc, AllEntertainment } from "@skylark-reference-apps/lib";

import { DataFetcher } from "./dataFetcher";

export const MainRail: FC<{ section: AllEntertainment }> = ({ section }) => {
  console.log("section", section);
  const items = section?.items ? section.items.objects : [];

  return (
    <Rail displayCount header={section.title?.medium || section.title?.short}>
      {items.map(({ self }, index) => (
        <DataFetcher key={index} self={self}>
          {(movie: AllEntertainment) => (
            <MovieThumbnail
              backgroundImage={getImageSrc(
                movie.images,
                "Thumbnail",
                "384x216"
              )}
              contentLocation="below"
              href={
                movie.type && movie.slug ? `/${movie.type}/${movie.slug}` : ""
              }
              key={movie.objectTitle || movie.uid || movie.slug}
              releaseDate={movie.releaseDate}
              title={movie.title?.short || ""}
            />
          )}
        </DataFetcher>
      ))}
    </Rail>
  );
};
