import useSWRInfinite from "swr/infinite";
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

const getKey = <T extends Metadata>(
  query: string,
  pageIndex: number,
  previousPageData: ListData<T> | null,
  dimensions: Dimensions
) => {
  if (previousPageData && !previousPageData.next_token) return null;

  if (pageIndex === 0) return [query, dimensions, ""];

  return [query, dimensions, previousPageData?.next_token];
};

const fetcher = <T extends Metadata>([query, dimensions, nextToken]: [
  query: string,
  dimensions: Dimensions,
  nextToken: string | null
]) =>
  skylarkRequestWithDimensions<{ listObjects: ListData<T> }>(
    query,
    dimensions,
    {
      language: dimensions.language,
      customerType: dimensions.customerType,
      deviceType: dimensions.deviceType,
      nextToken,
    }
  ).then(({ listObjects: data }) => data);

export const useListObjects = <T extends Metadata>(
  query: string,
  disabled?: boolean
) => {
  const { dimensions } = useDimensions();

  const { data, error, isLoading } = useSWRInfinite<ListData<T>, GQLError>(
    (pageIndex, previousPageData: ListData<T>) =>
      disabled ? null : getKey(query, pageIndex, previousPageData, dimensions),
    fetcher,
    {
      initialSize: 10,
    }
  );

  const objects: T[] | undefined =
    data &&
    (data.flatMap((item) => item.objects).filter((item) => !!item) as T[]);

  return {
    objects,
    isLoading: !query || isLoading || (!error && !data),
    isError: error,
  };
};
