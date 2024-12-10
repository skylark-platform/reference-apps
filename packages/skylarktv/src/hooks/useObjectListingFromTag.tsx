import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Episode, Movie, SkylarkTag } from "../types/gql";
import { GQLError } from "../types";
import { LIST_EPISODES_BY_TAG, LIST_MOVIES_BY_TAG } from "../graphql/queries";
import { skylarkRequestWithDimensions } from "../lib/utils";
import { useDimensions } from "../contexts";
import { Dimensions } from "../lib/interfaces";

const objectListingFromTagFetcher = (
  query: string,
  tagUid: string,
  dimensions: Dimensions,
  nextToken?: string,
) =>
  skylarkRequestWithDimensions<{ getObject: SkylarkTag }>(query, dimensions, {
    uid: tagUid,
    nextToken,
  });

const moviesSelect = (data: InfiniteData<{ getObject: SkylarkTag }>) => {
  const movies =
    data &&
    data.pages
      .flatMap(({ getObject }) => getObject?.movies?.objects)
      .filter((m): m is Movie => !!m);

  const tag = data?.pages?.[0].getObject;

  return {
    movies,
    tag,
  };
};

export const useMovieListingFromTag = (tagUid: string | null) => {
  const { dimensions, isLoadingDimensions } = useDimensions();

  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useInfiniteQuery<
      { getObject: SkylarkTag },
      GQLError,
      { tag: SkylarkTag; movies: Movie[] },
      QueryKey,
      string
    >({
      queryKey: ["LIST_MOVIES_BY_TAG", tagUid, dimensions],
      queryFn: ({ pageParam: nextToken }: { pageParam?: string }) =>
        objectListingFromTagFetcher(
          LIST_MOVIES_BY_TAG,
          tagUid as string,
          dimensions,
          nextToken,
        ),
      getNextPageParam: (lastPage): string | undefined =>
        lastPage.getObject.movies?.next_token || undefined,
      enabled: Boolean(tagUid && !isLoadingDimensions),
      initialPageParam: "",
      select: moviesSelect,
    });

  // This if statement ensures that all data is fetched
  // We could remove it and add a load more button
  if (hasNextPage) {
    void fetchNextPage();
  }

  return {
    ...data,
    isLoading,
    isError: error,
  };
};

const episodesSelect = (data: InfiniteData<{ getObject: SkylarkTag }>) => {
  const episodes: Episode[] | undefined =
    data &&
    data.pages
      .flatMap(({ getObject }) => getObject?.episodes?.objects)
      .filter((e): e is Episode => !!e);

  const tag = data?.pages?.[0].getObject;

  return {
    episodes,
    tag,
  };
};

export const useEpisodeListingFromTag = (tagUid: string | null) => {
  const { dimensions, isLoadingDimensions } = useDimensions();

  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useInfiniteQuery<
      { getObject: SkylarkTag },
      GQLError,
      { tag: SkylarkTag; episodes: Episode[] },
      QueryKey,
      string
    >({
      queryKey: ["LIST_EPISODES_BY_TAG", tagUid, dimensions],
      queryFn: ({ pageParam: nextToken }: { pageParam?: string }) =>
        objectListingFromTagFetcher(
          LIST_EPISODES_BY_TAG,
          tagUid as string,
          dimensions,
          nextToken,
        ),
      getNextPageParam: (lastPage): string | undefined =>
        lastPage.getObject.episodes?.next_token || undefined,
      enabled: Boolean(tagUid && !isLoadingDimensions),
      initialPageParam: "",
      select: episodesSelect,
    });

  // This if statement ensures that all data is fetched
  // We could remove it and add a load more button
  if (hasNextPage) {
    void fetchNextPage();
  }

  return {
    ...data,
    isLoading,
    isError: error,
  };
};
