import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";

import { MdRefresh } from "react-icons/md";

import {
  Button,
  Dropdown,
  MovieThumbnail,
} from "@skylark-reference-apps/react";

import { movieThumbnails, genres } from "../test-data";

const Movies: NextPage = () => {
  const [movies, loadMore] = useState(movieThumbnails);
  return (
    <div className="flex w-full justify-center py-20 px-gutter  sm:px-sm-gutter md:py-32 lg:px-lg-gutter xl:px-xl-gutter">
      <Head>
        <title>{`Skylark Media Reference App`}</title>
      </Head>
      <div>
        <div className="my-10 text-white">
          <h1 className="text-[40px] font-medium md:text-[56px]">{"Movies"}</h1>
          <div className="text-[16px]">
            {
              "Search 100’s of the latest and greatest titles, available to watch of Stream TV"
            }
          </div>
        </div>

        <div className="flex flex-row gap-x-2 pb-24">
          <Dropdown items={genres} label="Genres" />
          <Dropdown items={genres} label="Themes" />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
          {movies.map((movie) => (
            <div className="" key={movie.title}>
              <MovieThumbnail
                contentLocation="below"
                duration="1h 59m"
                key={movie.title}
                releaseDate="2020"
                {...movie}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-row justify-center py-28">
          <Button
            className=""
            icon={<MdRefresh />}
            iconPlacement="left"
            text="Load more"
            onClick={() => loadMore([...movies, ...movieThumbnails])}
          />
        </div>
      </div>
    </div>
  );
};

export default Movies;
