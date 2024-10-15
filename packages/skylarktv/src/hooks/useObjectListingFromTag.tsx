import { useInfiniteQuery } from "@tanstack/react-query";
import { Episode, SkylarkTag, Movie } from "../types/gql";
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

export const useMovieListingFromTag = (tagUid: string | null) => {
  const { dimensions, isLoadingDimensions } = useDimensions();

  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useInfiniteQuery<{ getObject: SkylarkTag }, GQLError>({
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

  const tag = data?.pages?.[0].getObject;

  return {
    tag,
    movies,
    isLoading,
    isError: error,
  };
};

export const useEpisodeListingFromTag = (tagUid: string | null) => {
  const { dimensions, isLoadingDimensions } = useDimensions();

  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useInfiniteQuery<{ getObject: SkylarkTag }, GQLError>({
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

  const tag = data?.pages?.[0].getObject;

  return {
    tag,
    episodes,
    isLoading,
    isError: error,
  };
};
