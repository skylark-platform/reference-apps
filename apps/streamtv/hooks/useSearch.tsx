import useSWR from "swr";
import { Dimensions } from "@skylark-reference-apps/lib";
import {
  useDimensions,
  skylarkRequestWithDimensions,
} from "@skylark-reference-apps/react";
import { SearchResultListing } from "../types/gql";
import { GQLError } from "../types";
import { SEARCH } from "../graphql/queries";

const fetcher = ([query, dimensions]: [
  query: string,
  dimensions: Dimensions
]) =>
  skylarkRequestWithDimensions<{ search: SearchResultListing }>(
    SEARCH,
    dimensions,
    {
      query,
      language: dimensions.language,
      customerType: dimensions.customerType,
      deviceType: dimensions.deviceType,
    }
  ).then(({ search: data }): SearchResultListing => data);

export const useSearch = (query: string) => {
  const { dimensions } = useDimensions();

  const { data, error, isLoading } = useSWR<SearchResultListing, GQLError>(
    query ? [query, dimensions] : null,
    fetcher
  );

  return {
    data,
    isLoading: !query || isLoading || (!error && !data),
    isError: error,
  };
};
