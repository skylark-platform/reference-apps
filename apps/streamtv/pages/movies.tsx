import { useState } from "react";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import { Dropdown, H4, SkeletonPage } from "@skylark-reference-apps/react";
import useTranslation from "next-translate/useTranslation";
import { Genre, Movie, ObjectTypes } from "../types/gql";

import { DisplayError } from "../components/displayError";
import { useListObjects } from "../hooks/useListObjects";
import { LIST_GENRES, LIST_MOVIES } from "../graphql/queries";
import { useMovieListingFromGenre } from "../hooks/useMovieListingFromGenre";
import { Thumbnail } from "../components/thumbnail";

const Movies: NextPage = () => {
  const [activeGenre, setActiveGenre] = useState<{ uid: string, name: string } | null>(null);

  const { objects: genres, isError: isGenreError } =
    useListObjects<Genre>(LIST_GENRES);
  const unfilteredMovies = useListObjects<Movie>(LIST_MOVIES);
  const filteredMoviesByGenre = useMovieListingFromGenre(activeGenre?.uid || null);

  const {
    movies,
    isError: isMovieError,
    isLoading,
  } = activeGenre
    ? filteredMoviesByGenre
    : { ...unfilteredMovies, movies: unfilteredMovies.objects };

  const { t } = useTranslation("common");

  const updateGenre = (newGenre: string) => {
    const genre = genres?.find((g) => g.name === newGenre);
    setActiveGenre(genre ? { uid: genre?.uid, name: newGenre } : null);
  };

  if (!isLoading && isMovieError) {
    return (
      <DisplayError error={isMovieError} notFoundMessage="No Movies found." />
    );
  }

  if (!isLoading && isGenreError) {
    return (
      <DisplayError error={isGenreError} notFoundMessage="No Genres found." />
    );
  }

  return (
    <div className="flex w-full flex-col justify-center bg-gray-900 py-20 font-body">
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
            items={genres?.map((genre) => genre.name || "").sort() || []}
            label="Genres"
            onChange={updateGenre}
          />
        </div>
      </div>
      {!isLoading &&
        (!movies ||
          movies.length === 0) && (
            <div className="text-center">
              <H4 className="mt-2 mb-0.5 text-white">{`No movies found${
                activeGenre ? ` for Genre: ${activeGenre.name}` : ""
              }`}</H4>
            </div>
          )}
      <SkeletonPage show={isLoading}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-gutter sm:px-sm-gutter md:grid-cols-3 lg:grid-cols-4 lg:px-lg-gutter xl:px-xl-gutter 2xl:grid-cols-6">
          {movies?.map((movie) => (
            <Thumbnail
              key={movie.uid}
              objectType={ObjectTypes.Movie}
              uid={movie.uid}
              variant="landscape-movie"
            />
          ))}
        </div>
      </SkeletonPage>
    </div>
  );
};

export default Movies;
