import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Episode, Genre, Movie } from "../types/gql";
import { GQLError } from "../types";
import {
  LIST_EPISODES_BY_GENRE,
  LIST_MOVIES_BY_GENRE,
} from "../graphql/queries";
import { skylarkRequestWithDimensions } from "../lib/utils";
import { useDimensions } from "../contexts";
import { Dimensions } from "../lib/interfaces";

function objectListingFromGenreFetcher<T>(
  query: string,
  genreUid: string,
  dimensions: Dimensions,
  nextToken?: string,
) {
  return skylarkRequestWithDimensions<{ getObject: T }>(query, dimensions, {
    uid: genreUid,
    nextToken,
  });
}

const moviesSelect = (data: InfiniteData<{ getObject: Genre }>): Movie[] =>
  data &&
  data.pages
    .flatMap(({ getObject }) => getObject?.movies?.objects)
    .filter((m): m is Movie => !!m);

export const useMovieListingFromGenre = (genreUid: string | null) => {
  const { dimensions, isLoadingDimensions } = useDimensions();

  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useInfiniteQuery<{ getObject: Genre }, GQLError, Movie[], QueryKey, string>(
      {
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
        enabled: Boolean(genreUid && !isLoadingDimensions),
        initialPageParam: "",
        select: moviesSelect,
      },
    );

  // This if statement ensures that all data is fetched
  // We could remove it and add a load more button
  if (hasNextPage) {
    void fetchNextPage();
  }

  return {
    movies: data,
    isLoading,
    isError: error,
  };
};

const episodesSelect = (data: InfiniteData<{ getObject: Genre }>): Episode[] =>
  data &&
  data.pages
    .flatMap(({ getObject }) => getObject?.episodes?.objects)
    .filter((e): e is Episode => !!e);

export const useEpisodeListingFromGenre = (genreUid: string | null) => {
  const { dimensions, isLoadingDimensions } = useDimensions();

  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useInfiniteQuery<
      { getObject: Genre },
      GQLError,
      Episode[],
      QueryKey,
      string
    >({
      queryKey: ["LIST_EPISODES_BY_GENRE", genreUid, dimensions],
      queryFn: ({ pageParam: nextToken }: { pageParam?: string }) =>
        objectListingFromGenreFetcher(
          LIST_EPISODES_BY_GENRE,
          genreUid as string,
          dimensions,
          nextToken,
        ),
      getNextPageParam: (lastPage): string | undefined =>
        lastPage.getObject.episodes?.next_token || undefined,
      enabled: Boolean(genreUid && !isLoadingDimensions),
      initialPageParam: "",
      select: episodesSelect,
    });

  // This if statement ensures that all data is fetched
  // We could remove it and add a load more button
  if (hasNextPage) {
    void fetchNextPage();
  }

  return {
    episodes: data,
    isLoading,
    isError: error,
  };
};
