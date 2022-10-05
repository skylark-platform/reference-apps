import useSWRInfinite from "swr/infinite";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { graphQLClient } from "@skylark-reference-apps/lib";
import { Movie, MovieListing } from "../types/gql";

const createGraphQLQuery = (nextToken?: string) => {
  const method = `listMovie`;

  const queryAsJson = {
    query: {
      __name: method,
      [method]: {
        __args: {
          ignore_availability: true,
          next_token: nextToken || "",
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

const movieListingFetcher = ([, nextToken]: [
  name: string,
  nextToken?: string
]) => {
  const { query, method } = createGraphQLQuery(nextToken);
  return graphQLClient
    .request<{ [key: string]: MovieListing }>(query)
    .then(({ [method]: data }): MovieListing => data);
};

const getKey = (pageIndex: number, previousPageData: MovieListing | null) => {
  if (previousPageData && !previousPageData.next_token) return null;

  if (pageIndex === 0) return ["MovieListing", ""];

  return ["MovieListing", previousPageData?.next_token];
};

export const useMovieListing = (disable = false) => {
  const { data, error, isLoading } = useSWRInfinite<MovieListing, Error>(
    (pageIndex, previousPageData: MovieListing) =>
      disable ? null : getKey(pageIndex, previousPageData),
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
