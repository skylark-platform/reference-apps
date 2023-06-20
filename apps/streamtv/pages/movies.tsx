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
import { Grid } from "../components/grid";

const Movies: NextPage = () => {
  const [activeGenre, setActiveGenre] = useState<{
    uid: string;
    name: string;
  } | null>(null);

  const { objects: genres, isError: isGenreError } =
    useListObjects<Genre>(LIST_GENRES);
  const unfilteredMovies = useListObjects<Movie>(LIST_MOVIES);
  const filteredMoviesByGenre = useMovieListingFromGenre(
    activeGenre?.uid || null
  );

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
        <div className="flex flex-row gap-x-2 pb-6 md:pb-16 xl:pb-20">
          <Dropdown
            items={genres?.map((genre) => genre.name || "").sort() || []}
            label="Genres"
            onChange={updateGenre}
          />
        </div>
      </div>
      {!isLoading && (!movies || movies.length === 0) && (
        <div className="text-center">
          <H4 className="mb-0.5 mt-2 text-white">{`No movies found${
            activeGenre ? ` for Genre: ${activeGenre.name}` : ""
          }`}</H4>
        </div>
      )}
      <SkeletonPage show={isLoading && !movies}>
        {movies && (
          <Grid
            objects={movies.map(
              (movie): Movie => ({ ...movie, __typename: ObjectTypes.Movie })
            )}
            variant="landscape-movie"
          />
        )}
      </SkeletonPage>
    </div>
  );
};

export default Movies;
