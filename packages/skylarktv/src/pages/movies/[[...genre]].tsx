import { useState } from "react";
import type { NextPage } from "next";

import { useRouter } from "next/router";
import { DisplayError } from "../../components/displayError";
import { useListObjects } from "../../hooks/useListObjects";
import { ListObjectsWithGenreFilter } from "../../components/pages/listWithGenreFilter/listWithGenreFilter.page";
import { LIST_MOVIES } from "../../graphql/queries";
import { useMovieListingFromGenre } from "../../hooks/useObjectListingFromGenre";
import { Movie } from "../../types";

const Movies: NextPage = () => {
  const { query } = useRouter();
  const genreFromUrl =
    typeof query?.genre?.[0] === "string" ? query.genre?.[0] : null;

  const [activeGenre, setActiveGenre] = useState<{
    uid: string;
    name: string;
  } | null>(null);

  const activeGenreUid = genreFromUrl || activeGenre?.uid || null;

  const unfilteredMovies = useListObjects<Movie>(LIST_MOVIES);
  const filteredMoviesByGenre = useMovieListingFromGenre(activeGenreUid);

  const {
    movies,
    isError: isMovieError,
    isLoading,
  } = activeGenreUid
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
      hideGenreSelector={Boolean(genreFromUrl)}
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
