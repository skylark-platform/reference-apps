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

const fieldsToExpand = {
  image_urls: {},
  genre_urls: {},
};

const fields = {
  title_short: {},
  title_medium: {},
  slug: {},
  type: {},
  self: {},
  image_urls: {
    self: {},
    url: {},
    url_path: {},
    image_type: {},
  },
  genre_urls: {
    name: {},
  },
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

  return fetch(getSelectedGenreMovieEndpoint, {
    headers: { "Accept-Language": "en-gb" },
  })
    .then((r) => r.json())
    .then(({ objects: movies }: ApiMultipleEntertainmentObjects) =>
      movies.map((movie) => parseSkylarkObject(movie))
    );
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
