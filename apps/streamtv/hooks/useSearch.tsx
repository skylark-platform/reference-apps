import useSWR from "swr";
import { Dimensions } from "@skylark-reference-apps/lib";
import {
  useDimensions,
  skylarkRequestWithDimensions,
} from "@skylark-reference-apps/react";
import {
  SkylarkSet,
  Brand,
  Episode,
  Movie,
  Person,
  SearchResultListing,
  StreamTVSupportedSetType,
  GQLError,
} from "../types";
import { SEARCH } from "../graphql/queries";

interface SearchResult extends Omit<SearchResultListing, "objects"> {
  objects: (SkylarkSet | Brand | Episode | Movie | Person)[];
}

const fetcher = ([query, dimensions]: [
  query: string,
  dimensions: Dimensions
]) =>
  skylarkRequestWithDimensions<{ search: SearchResult }>(SEARCH, dimensions, {
    query,
    language: dimensions.language,
    customerType: dimensions.customerType,
    deviceType: dimensions.deviceType,
  }).then(({ search: data }): SearchResult => data);

export const useSearch = (query: string) => {
  const { dimensions } = useDimensions();

  const { data, error, isLoading } = useSWR<SearchResult, GQLError>(
    query ? [query, dimensions] : null,
    fetcher
  );

  // Filter SkylarkSet results to only collections (as StreamTV only has pages for collections)
  const objects = data?.objects.filter(
    (obj) =>
      obj.__typename !== "SkylarkSet" ||
      obj.type === StreamTVSupportedSetType.Collection
  );

  return {
    data: {
      ...data,
      objects,
    },
    isLoading: !query || isLoading || (!error && !data),
    isError: error,
  };
};
