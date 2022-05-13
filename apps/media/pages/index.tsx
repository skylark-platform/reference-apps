import type { NextPage } from "next";
import Head from "next/head";
import {
  Carousel,
  CollectionThumbnail,
  EpisodeThumbnail,
  MovieThumbnail,
  Rail,
} from "@skylark-reference-apps/react";
import { useRouter } from "next/router";

import {
  heros,
  movieThumbnails,
  episodeThumbnails,
  collectionThumbnails,
} from "../test-data";

const Home: NextPage = () => {
  const { query } = useRouter();

  const activeCarouselItem = query?.carousel_item
    ? parseInt(query.carousel_item as string, 10)
    : undefined;

  return (
    <div className="mb-20 flex min-h-screen flex-col items-center bg-gray-900">
      <Head>
        <title>{`Skylark Media Reference App`}</title>
      </Head>

      <div className="h-[90vh] w-full md:h-[95vh]">
        <Carousel
          activeItem={activeCarouselItem}
          changeInterval={6}
          items={heros}
        />
      </div>

      <div className="my-6 w-full">
        <Rail displayCount header="Movies">
          {movieThumbnails.map((movie) => (
            <MovieThumbnail
              contentLocation="below"
              key={movie.title}
              {...movie}
            />
          ))}
        </Rail>
      </div>

      <div className="my-6 w-full">
        <Rail displayCount header="Game of Thrones">
          {episodeThumbnails.map((ep) => (
            <EpisodeThumbnail key={ep.title} {...ep} />
          ))}
        </Rail>
      </div>

      <div className="my-6 w-full">
        <Rail displayCount header="Discover">
          {collectionThumbnails.map((collection) => (
            <CollectionThumbnail key={collection.title} {...collection} />
          ))}
        </Rail>
      </div>
    </div>
  );
};

export default Home;
