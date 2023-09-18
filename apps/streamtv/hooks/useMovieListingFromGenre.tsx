import { useInfiniteQuery } from "@tanstack/react-query";
import { Dimensions } from "@skylark-reference-apps/lib";
import {
  useDimensions,
  skylarkRequestWithDimensions,
} from "@skylark-reference-apps/react";
import { Genre, Movie } from "../types/gql";
import { GQLError } from "../types";
import { LIST_MOVIES_BY_GENRE } from "../graphql/queries";

const movieListingFromGenreFetcher = (
  genreUid: string,
  dimensions: Dimensions,
  nextToken?: string,
) =>
  skylarkRequestWithDimensions<{ getObject: Genre }>(
    LIST_MOVIES_BY_GENRE,
    dimensions,
    {
      uid: genreUid,
      nextToken,
    },
  );

export const useMovieListingFromGenre = (genreUid: string | null) => {
  const { dimensions } = useDimensions();

  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useInfiniteQuery<{ getObject: Genre }, GQLError>({
      queryKey: ["LIST_MOVIES_BY_GENRE", genreUid, dimensions],
      queryFn: ({ pageParam: nextToken }: { pageParam?: string }) =>
        movieListingFromGenreFetcher(genreUid as string, dimensions, nextToken),
      getNextPageParam: (lastPage): string | undefined =>
        lastPage.getObject.movies?.next_token || undefined,
      enabled: !!genreUid,
    });

  // This if statement ensures that all data is fetched
  // We could remove it and add a load more button
  if (hasNextPage) {
    void fetchNextPage();
  }

  const movies: Movie[] | undefined =
    data &&
    (data.pages
      .flatMap(({ getObject }) => getObject?.movies?.objects)
      .filter((movie) => !!movie) as Movie[]);

  return {
    movies,
    isLoading,
    isError: error,
  };
};
