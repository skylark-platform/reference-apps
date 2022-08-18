import axios from "axios";
import useSWR from "swr";
import {
  createSkylarkApiQuery,
  SKYLARK_API,
  parseSkylarkObject,
  AllEntertainment,
  Movie,
  ApiMultipleEntertainmentObjects,
  convertObjectTypeToSkylarkEndpoint,
  EntertainmentType,
} from "@skylark-reference-apps/lib";

const fieldsToExpand = {};

const fields = {
  uid: {},
  self: {},
};

export const moviesSetFetcher = ([endpoint, genreUid]: [
  endpoint: string,
  genreUid: string
]) => {
  const apiQuery = createSkylarkApiQuery({
    fieldsToExpand,
    fields,
  });

  const getSelectedGenreMovieEndpoint = genreUid
    ? `${SKYLARK_API}/api/${endpoint}/?genres_url=${genreUid}&${apiQuery}`
    : `${SKYLARK_API}/api/${endpoint}/?${apiQuery}`;

  return axios
    .get<ApiMultipleEntertainmentObjects>(getSelectedGenreMovieEndpoint, {
      headers: { "Accept-Language": "en-gb" },
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
