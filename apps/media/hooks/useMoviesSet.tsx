import axios from "axios";
import useSWR from "swr";
import {
  createSkylarkRequestQueryAndHeaders,
  SKYLARK_API,
  parseSkylarkObject,
  AllEntertainment,
  Movie,
  ApiMultipleEntertainmentObjects,
  convertObjectTypeToSkylarkEndpoint,
  EntertainmentType,
  Dimensions,
} from "@skylark-reference-apps/lib";

const fieldsToExpand = {};

const fields = {
  uid: {},
  self: {},
  slug: {},
};

export const moviesSetFetcher = ([endpoint, genreUid, dimensions]: [
  endpoint: string,
  genreUid: string,
  dimensions: Dimensions
]) => {
  const { query, headers } = createSkylarkRequestQueryAndHeaders({
    fieldsToExpand,
    fields,
    dimensions,
  });

  const getSelectedGenreMovieEndpoint = genreUid
    ? `${SKYLARK_API}/api/${endpoint}/?genres_url=${genreUid}&${query}`
    : `${SKYLARK_API}/api/${endpoint}/?${query}`;

  return axios
    .get<ApiMultipleEntertainmentObjects>(getSelectedGenreMovieEndpoint, {
      headers,
    })
    .then(({ data }) => {
      const { objects: movies } = data;
      return movies.map((movie) => parseSkylarkObject(movie));
    });
};

export const useAllMovies = (type: EntertainmentType, genreUid?: string) => {
  const endpoint = convertObjectTypeToSkylarkEndpoint(type);
  const { data, error } = useSWR<AllEntertainment[], Error>(
    [endpoint, genreUid],
    moviesSetFetcher
  );

  return {
    movies: data as Movie[],
    isLoading: !error && !data,
    isError: error,
  };
};
