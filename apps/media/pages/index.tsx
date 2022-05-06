import type { NextPage } from "next";
import Head from "next/head";
import {
  Carousel,
  CollectionThumbnail,
  EpisodeThumbnail,
  MovieThumbnail,
  Rail,
} from "@skylark-reference-apps/react";

import {
  heros,
  movieThumbnails,
  episodeThumbnails,
  collectionThumbnails,
} from "../test-data";

const Home: NextPage = () => (
  <div className="mb-20 flex min-h-screen flex-col items-center bg-gray-900">
    <Head>
      <title>{`Skylark Media Reference App`}</title>
    </Head>

    <div className="h-[90vh] w-full md:h-[95vh]">
      <Carousel changeInterval={6} items={heros} />
    </div>

    <div className="my-6 w-full">
      <h2 className="ml-sm-gutter text-2xl font-normal text-white md:ml-md-gutter lg:ml-lg-gutter xl:ml-xl-gutter">
        {`Movies`}
        <span className="ml-1 text-gray-500">{`(${movieThumbnails.length})`}</span>
      </h2>
      <Rail>
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
      <h2 className="ml-sm-gutter text-2xl font-normal text-white md:ml-md-gutter lg:ml-lg-gutter xl:ml-xl-gutter">
        {`Game of Thrones`}
        <span className="ml-1 text-gray-500">{`(${episodeThumbnails.length})`}</span>
      </h2>
      <Rail>
        {episodeThumbnails.map((ep) => (
          <EpisodeThumbnail key={ep.title} {...ep} />
        ))}
      </Rail>
    </div>

    <div className="my-6 w-full">
      <h2 className="ml-sm-gutter text-2xl font-normal text-white md:ml-md-gutter lg:ml-lg-gutter xl:ml-xl-gutter">
        {`Discover`}
        <span className="ml-1 text-gray-500">{`(${collectionThumbnails.length})`}</span>
      </h2>
      <Rail>
        {collectionThumbnails.map((collection) => (
          <CollectionThumbnail key={collection.title} {...collection} />
        ))}
      </Rail>
    </div>
  </div>
);

export default Home;
