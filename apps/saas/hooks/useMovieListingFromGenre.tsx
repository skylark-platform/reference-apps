import { jsonToGraphQLQuery } from "json-to-graphql-query";
import useSWR from "swr";
import { graphQLClient } from "@skylark-reference-apps/lib";
import { Genre, MovieListing } from "../types/gql";

const createGraphQLQuery = (genreUid: string) => {
  const method = `getGenre`;

  const queryAsJson = {
    query: {
      __name: method,
      [method]: {
        __args: {
          uid: genreUid,
          ignore_availability: true,
        },
        movies: {
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

const movieListingFromGenreFetcher = ([, genreUid]: [
  key: string,
  genreUid: string
]) => {
  const { query, method } = createGraphQLQuery(genreUid);
  return graphQLClient
    .request<{ [key: string]: Genre }>(query)
    .then(({ [method]: data }): Genre => data)
    .then((genre) => genre.movies as MovieListing);
};

export const useMovieListingFromGenre = (genreUid?: string) => {
  const { data, error, isLoading } = useSWR<MovieListing, Error>(
    // Don't fetch when genreUid is falsy
    genreUid ? ["MovieListing", genreUid] : null,
    movieListingFromGenreFetcher
  );

  return {
    movies: data,
    isLoading,
    isError: error,
  };
};
