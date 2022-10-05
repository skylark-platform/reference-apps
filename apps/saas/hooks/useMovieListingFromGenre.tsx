import { jsonToGraphQLQuery } from "json-to-graphql-query";
import useSWRInfinite from "swr/infinite";
import { Dimensions, graphQLClient } from "@skylark-reference-apps/lib";
import { useDimensions } from "@skylark-reference-apps/react";
import { Genre, MovieListing, Movie } from "../types/gql";
import { addDimensionsToGraphQLMutation } from "../lib/utils";

const createGraphQLQuery = (genreUid: string, dimensions: Dimensions, nextToken?: string) => {
  const method = `getGenre`;

  const queryAsJson = {
    query: {
      __name: method,
      [method]: {
        __args: {
          uid: genreUid,
          ...addDimensionsToGraphQLMutation(dimensions),
        },
        movies: {
          __args: {
            next_token: nextToken || "",
          },
          next_token: true,
          objects: {
            uid: true,
          },
        },
      },
    },
  };

  const query = jsonToGraphQLQuery(queryAsJson);

  return { query, method };
};

const movieListingFromGenreFetcher = ([, genreUid, dimensions, nextToken]: [
  key: string,
  genreUid: string,
  dimensions: Dimensions,
  nextToken?: string
]) => {
  const { query, method } = createGraphQLQuery(genreUid, dimensions, nextToken);
  return graphQLClient
    .request<{ [key: string]: Genre }>(query)
    .then(({ [method]: data }): Genre => data)
    .then((genre) => genre.movies as MovieListing);
};

const getKey = (
  pageIndex: number,
  previousPageData: MovieListing | null,
  genreUid: string,
  dimensions: Dimensions
) => {
  if (previousPageData && !previousPageData.next_token) return null;

  if (pageIndex === 0) return ["MovieListing", genreUid, dimensions, ""];

  return ["MovieListing", genreUid, dimensions, previousPageData?.next_token];
};

export const useMovieListingFromGenre = (genreUid?: string) => {
  const { dimensions } = useDimensions();

  const { data, error, isLoading } = useSWRInfinite<MovieListing, Error>(
    (pageIndex, previousPageData: MovieListing) =>
      genreUid ? getKey(pageIndex, previousPageData, genreUid, dimensions) : null,
    movieListingFromGenreFetcher,
    {
      initialSize: 10,
    }
  );

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
