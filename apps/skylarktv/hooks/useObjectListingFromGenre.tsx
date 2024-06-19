import { useInfiniteQuery } from "@tanstack/react-query";
import { Dimensions } from "@skylark-reference-apps/lib";
import {
  useDimensions,
  skylarkRequestWithDimensions,
} from "@skylark-reference-apps/react";
import { Episode, Genre, Movie } from "../types/gql";
import { GQLError } from "../types";
import {
  LIST_EPISODES_BY_GENRE,
  LIST_MOVIES_BY_GENRE,
} from "../graphql/queries";

const objectListingFromGenreFetcher = (
  query: string,
  genreUid: string,
  dimensions: Dimensions,
  nextToken?: string,
) =>
  skylarkRequestWithDimensions<{ getObject: Genre }>(query, dimensions, {
    uid: genreUid,
    nextToken,
  });

export const useMovieListingFromGenre = (genreUid: string | null) => {
  const { dimensions } = useDimensions();

  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useInfiniteQuery<{ getObject: Genre }, GQLError>({
      queryKey: ["LIST_MOVIES_BY_GENRE", genreUid, dimensions],
      queryFn: ({ pageParam: nextToken }: { pageParam?: string }) =>
        objectListingFromGenreFetcher(
          LIST_MOVIES_BY_GENRE,
          genreUid as string,
          dimensions,
          nextToken,
        ),
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
    data.pages
      .flatMap(({ getObject }) => getObject?.movies?.objects)
      .filter((m): m is Movie => !!m);

  return {
    movies,
    isLoading,
    isError: error,
  };
};

export const useEpisodeListingFromGenre = (genreUid: string | null) => {
  const { dimensions } = useDimensions();

  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useInfiniteQuery<{ getObject: Genre }, GQLError>({
      queryKey: ["LIST_EPISODES_BY_GENRE", genreUid, dimensions],
      queryFn: ({ pageParam: nextToken }: { pageParam?: string }) =>
        objectListingFromGenreFetcher(
          LIST_EPISODES_BY_GENRE,
          genreUid as string,
          dimensions,
          nextToken,
        ),
      getNextPageParam: (lastPage): string | undefined =>
        lastPage.getObject.movies?.next_token || undefined,
      enabled: !!genreUid,
    });

  // This if statement ensures that all data is fetched
  // We could remove it and add a load more button
  if (hasNextPage) {
    void fetchNextPage();
  }

  const episodes: Episode[] | undefined =
    data &&
    data.pages
      .flatMap(({ getObject }) => getObject?.episodes?.objects)
      .filter((e): e is Episode => !!e);

  return {
    episodes,
    isLoading,
    isError: error,
  };
};
