import { jsonToGraphQLQuery } from "json-to-graphql-query";
import useSWRInfinite from "swr/infinite";
import { graphQLClient } from "@skylark-reference-apps/lib";
import { Genre, MovieListing, Movie } from "../types/gql";

const createGraphQLQuery = (genreUid: string, nextToken?: string) => {
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

const movieListingFromGenreFetcher = ([, genreUid, nextToken]: [
  key: string,
  genreUid: string,
  nextToken?: string
]) => {
  const { query, method } = createGraphQLQuery(genreUid, nextToken);
  return graphQLClient
    .request<{ [key: string]: Genre }>(query)
    .then(({ [method]: data }): Genre => data)
    .then((genre) => genre.movies as MovieListing);
};

const getKey = (
  pageIndex: number,
  previousPageData: MovieListing | null,
  genreUid: string
) => {
  if (previousPageData && !previousPageData.next_token) return null;

  if (pageIndex === 0) return ["MovieListing", genreUid, ""];

  return ["MovieListing", genreUid, previousPageData?.next_token];
};

export const useMovieListingFromGenre = (genreUid?: string) => {
  const { data, error, isLoading } = useSWRInfinite<MovieListing, Error>(
    (pageIndex, previousPageData: MovieListing) =>
      genreUid ? getKey(pageIndex, previousPageData, genreUid) : null,
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
