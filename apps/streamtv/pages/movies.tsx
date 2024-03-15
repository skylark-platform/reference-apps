import { useState } from "react";
import type { NextPage } from "next";

import { DisplayError } from "../components/displayError";
import { useListObjects } from "../hooks/useListObjects";
import { ListObjectsWithGenreFilter } from "../components/pages/listWithGenreFilter/listWithGenreFilter.page";
import { LIST_MOVIES } from "../graphql/queries";
import { useMovieListingFromGenre } from "../hooks/useObjectListingFromGenre";
import { Movie } from "../types";

const Movies: NextPage = () => {
  const [activeGenre, setActiveGenre] = useState<{
    uid: string;
    name: string;
  } | null>(null);

  const unfilteredMovies = useListObjects<Movie>(LIST_MOVIES);
  const filteredMoviesByGenre = useMovieListingFromGenre(
    activeGenre?.uid || null,
  );

  const {
    movies,
    isError: isMovieError,
    isLoading,
  } = activeGenre
    ? filteredMoviesByGenre
    : { ...unfilteredMovies, movies: unfilteredMovies.objects };

  if (!isLoading && isMovieError) {
    return (
      <DisplayError error={isMovieError} notFoundMessage="No Movies found." />
    );
  }

  return (
    <ListObjectsWithGenreFilter
      activeGenre={activeGenre}
      isLoadingObjects={isLoading}
      objects={movies || null}
      setActiveGenre={setActiveGenre}
      thumbnailVariant="landscape-movie"
      translationKeys={{
        title: "movies",
        description: "movies-page-description",
      }}
    />
  );
};

export default Movies;
