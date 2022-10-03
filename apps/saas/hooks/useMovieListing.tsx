import useSWR from "swr";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { graphQLClient } from "@skylark-reference-apps/lib";
import { MovieListing } from "../types/gql";

const createGraphQLQuery = () => {
  const method = `listMovie`;

  const queryAsJson = {
    query: {
      __name: method,
      [method]: {
        __args: {
          ignore_availability: true,
        },
        objects: {
          uid: true,
        },
      },
    },
  };

  const query = jsonToGraphQLQuery(queryAsJson);

  return { query, method };
};

const movieListingFetcher = () => {
  const { query, method } = createGraphQLQuery();
  return graphQLClient
    .request<{ [key: string]: MovieListing }>(query)
    .then(({ [method]: data }): MovieListing => data);
};

export const useMovieListing = (disable = false) => {
  const { data, error, isLoading } = useSWR<MovieListing, Error>(
    // When disable is true, don't fetch
    disable ? null : "MovieListing",
    movieListingFetcher
  );

  return {
    movies: data,
    isLoading,
    isError: error,
  };
};
