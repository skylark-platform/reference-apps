import useSWRInfinite from "swr/infinite";
import { Dimensions } from "@skylark-reference-apps/lib";
import {
  useDimensions,
  skylarkRequestWithDimensions,
} from "@skylark-reference-apps/react";
import { Genre, MovieListing, Movie } from "../types/gql";
import { GQLError } from "../types";
import { LIST_MOVIES_BY_GENRE } from "../graphql/queries";

const movieListingFromGenreFetcher = ([uid, dimensions, nextToken]: [
  genreUid: string,
  dimensions: Dimensions,
  nextToken?: string
]) =>
  skylarkRequestWithDimensions<{ getObject: Genre }>(
    LIST_MOVIES_BY_GENRE,
    dimensions,
    {
      uid,
      language: dimensions.language,
      customerType: dimensions.customerType,
      deviceType: dimensions.deviceType,
      nextToken,
    }
  )
    .then(({ getObject: data }): Genre => data)
    .then((genre) => genre.movies as MovieListing);

const getKey = (
  pageIndex: number,
  previousPageData: MovieListing | null,
  genreUid: string,
  dimensions: Dimensions
) => {
  if (previousPageData && !previousPageData.next_token) return null;

  if (pageIndex === 0) return [genreUid, dimensions, ""];

  return [genreUid, dimensions, previousPageData?.next_token];
};

export const useMovieListingFromGenre = (genreUid: string | null) => {
  const { dimensions } = useDimensions();

  const { data, error, isLoading } = useSWRInfinite<MovieListing, GQLError>(
    (pageIndex, previousPageData: MovieListing) =>
      genreUid
        ? getKey(pageIndex, previousPageData, genreUid, dimensions)
        : null,
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
