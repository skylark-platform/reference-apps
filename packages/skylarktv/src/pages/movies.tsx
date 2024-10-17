import { useState } from "react";
import type { NextPage } from "next";

import { useRouter } from "next/router";
import { DisplayError } from "../components/displayError";
import { useListObjects } from "../hooks/useListObjects";
import { ListObjectsWithGenreFilter } from "../components/pages/listWithGenreFilter/listWithGenreFilter.page";
import { LIST_MOVIES } from "../graphql/queries";
import { useMovieListingFromGenre } from "../hooks/useObjectListingFromGenre";
import { Movie } from "../types";
import { useMovieListingFromTag } from "../hooks/useObjectListingFromTag";
import { ListObjects } from "../components/pages/listObjects/listObjects.page";

const GenrePage = ({ genreFromUrl }: { genreFromUrl: string | null }) => {
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

const TagPage = ({ tagFromUrl }: { tagFromUrl: string | null }) => {
  const { tag, movies, isLoading } = useMovieListingFromTag(tagFromUrl);

  return (
    <ListObjects
      isLoadingObjects={isLoading}
      objects={movies || []}
      thumbnailVariant="landscape"
      translationKeys={{
        title: tag?.name || "episodes",
        description: !tag ? "movies-page-description" : undefined,
      }}
    />
  );
};

const Movies: NextPage = () => {
  const { query } = useRouter();
  const genreFromUrl = typeof query?.genre === "string" ? query.genre : null;

  const tagFromUrl = typeof query?.tag === "string" ? query.tag : null;

  return tagFromUrl ? (
    <TagPage tagFromUrl={tagFromUrl} />
  ) : (
    <GenrePage genreFromUrl={genreFromUrl} />
  );
};

export default Movies;
