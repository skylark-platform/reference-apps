import { useState } from "react";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  Dropdown,
  MovieThumbnail,
  SkeletonPage,
  H4,
} from "@skylark-reference-apps/react";
import useTranslation from "next-translate/useTranslation";

import { getImageSrc, formatYear } from "@skylark-reference-apps/lib";
import { useAllMovies } from "../hooks/useMoviesSet";
import { useAllGenres } from "../hooks/useGenres";

import { DataFetcher } from "../components/dataFetcher";

const Movies: NextPage = () => {
  const [genre, setGenre] = useState("");
  const { genres } = useAllGenres();
  const selectedGenreUid = genres?.find(({ name }) => name === genre);
  const { movies, isLoading } = useAllMovies("movie", selectedGenreUid?.uid);
  const { t } = useTranslation("common");

  return (
    <div className="flex w-full flex-col justify-center py-20">
      <NextSeo title={t("movies")} />
      <div className="px-gutter sm:px-sm-gutter md:pt-20 lg:px-lg-gutter xl:px-xl-gutter">
        <div className="my-10 text-white">
          <h1 className="text-[40px] font-medium md:text-[56px]">
            {t("movies")}
          </h1>
          <div className="text-[16px]">{t("movies-page-description")}</div>
        </div>
        <div className="flex flex-row gap-x-2 pb-8 md:pb-20 xl:pb-24">
          <Dropdown
            items={genres?.map(({ name }) => name) || []}
            label="Genres"
            onChange={setGenre}
          />
        </div>
      </div>
      {!movies ||
        (movies.length === 0 && (
          <div className="text-center">
            <H4 className="mt-2 mb-0.5 text-white">{`No movies found for Genre: ${genre}`}</H4>
          </div>
        ))}
      <SkeletonPage show={isLoading}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-gutter sm:px-sm-gutter md:grid-cols-3 lg:grid-cols-4 lg:px-lg-gutter xl:px-xl-gutter 2xl:grid-cols-6">
          {movies?.map(({ self, slug }) => (
            <DataFetcher key={`movie-${slug}`} self={self} slug={slug}>
              {(movie) => (
                <MovieThumbnail
                  backgroundImage={getImageSrc(
                    movie?.images,
                    "Thumbnail",
                    "384x216"
                  )}
                  contentLocation="below"
                  duration="1h 59m"
                  href={
                    movie.type && movie.slug
                      ? `/${movie.type}/${movie.slug}`
                      : ""
                  }
                  key={movie.objectTitle || movie.uid || movie.slug}
                  releaseDate={formatYear(movie.releaseDate)}
                  title={movie.title?.short || ""}
                />
              )}
            </DataFetcher>
          ))}
        </div>
      </SkeletonPage>
    </div>
  );
};

export default Movies;
