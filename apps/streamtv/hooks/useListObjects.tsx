import { useInfiniteQuery } from "@tanstack/react-query";
import { Dimensions } from "@skylark-reference-apps/lib";
import {
  useDimensions,
  skylarkRequestWithDimensions,
} from "@skylark-reference-apps/react";
import { Metadata } from "../types/gql";
import { GQLError } from "../types";

interface ListData<T extends Metadata> {
  objects?: T[];
  next_token?: string | null;
}

const fetcher = <T extends Metadata>(
  query: string,
  dimensions: Dimensions,
  nextToken?: string | null
) =>
  skylarkRequestWithDimensions<{ listObjects: ListData<T> }>(
    query,
    dimensions,
    {
      nextToken,
    }
  );

export const useListObjects = <T extends Metadata>(
  query: string,
  disabled?: boolean
) => {
  const { dimensions } = useDimensions();

  const { data, isLoading, error, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [query, Object.values(dimensions)],
      queryFn: ({ pageParam: nextToken }: { pageParam?: string }) =>
        fetcher(query, dimensions, nextToken),
      getNextPageParam: (lastPage): string | undefined =>
        lastPage.listObjects?.next_token || undefined,
      enabled: !disabled,
    });

  // This if statement ensures that all data is fetched
  // We could remove it and add a load more button
  if (hasNextPage) {
    void fetchNextPage();
  }

  const objects: T[] | undefined =
    data &&
    (data.pages
      .flatMap((item) => item.listObjects.objects)
      .filter((item) => !!item) as T[]);

  return {
    objects,
    isLoading,
    isError: error as GQLError,
  };
};
