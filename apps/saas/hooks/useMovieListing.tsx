import useSWRInfinite from "swr/infinite";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { Dimensions } from "@skylark-reference-apps/lib";
import {
  useDimensions,
  skylarkRequestWithDimensions,
} from "@skylark-reference-apps/react";
import { Movie, MovieListing } from "../types/gql";
import { createGraphQLQueryDimensions } from "../lib/utils";
import { GQLError } from "../types";

const createGraphQLQuery = (dimensions: Dimensions, nextToken?: string) => {
  const method = `listMovie`;

  const queryAsJson = {
    query: {
      __name: method,
      [method]: {
        __args: {
          next_token: nextToken || "",
          ...createGraphQLQueryDimensions(dimensions),
        },
        next_token: true,
        objects: {
          uid: true,
        },
      },
    },
  };

  const query = jsonToGraphQLQuery(queryAsJson);

  return { query, method };
};

const movieListingFetcher = ([, dimensions, nextToken]: [
  name: string,
  dimensions: Dimensions,
  nextToken?: string
]) => {
  const { query, method } = createGraphQLQuery(dimensions, nextToken);
  return skylarkRequestWithDimensions<{ [key: string]: MovieListing }>(
    query,
    dimensions
  ).then(({ [method]: data }): MovieListing => data);
};

const getKey = (
  pageIndex: number,
  previousPageData: MovieListing | null,
  dimensions: Dimensions
) => {
  if (previousPageData && !previousPageData.next_token) return null;

  if (pageIndex === 0) return ["MovieListing", dimensions, ""];

  return ["MovieListing", dimensions, previousPageData?.next_token];
};

export const useMovieListing = (disable = false) => {
  const { dimensions } = useDimensions();

  const { data, error, isLoading } = useSWRInfinite<MovieListing, GQLError>(
    (pageIndex, previousPageData: MovieListing) =>
      disable ? null : getKey(pageIndex, previousPageData, dimensions),
    movieListingFetcher,
    {
      initialSize: 10,
    }
  );

  // Allow movies to be undefined as an empty array is truthy and would break isLoading
  const movies: Movie[] | undefined =
    data &&
    (data
      .flatMap((movieListing) => movieListing.objects)
      .filter((movie) => !!movie) as Movie[]);

  return {
    movies,
    isLoading: isLoading && !data,
    isError: error,
  };
};
