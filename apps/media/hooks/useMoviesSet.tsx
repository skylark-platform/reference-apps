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

const fieldsToExpand = {
  image_urls: {},
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
};

export const moviesSetFetcher = (endpoint: string) => {
  const apiQuery = createSkylarkApiQuery({
    fieldsToExpand,
    fields,
  });

  return axios
    .get<ApiMultipleEntertainmentObjects>(
      `${SKYLARK_API}/api/${endpoint}/?${apiQuery}`,
      {
        headers: { "Accept-Language": "en-gb" },
      }
    )
    .then(({ data }) => {
      const { objects: movies } = data;
      return movies.map((movie) => parseSkylarkObject(movie));
    });
};

export const useAllMovies = (type: EntertainmentType) => {
  const endpoint = convertObjectTypeToSkylarkEndpoint(type);
  const { data, error } = useSWR<AllEntertainment[], Error>(
    [endpoint],
    moviesSetFetcher
  );

  return {
    movies: data as Movie[],
    isLoading: !error && !data,
    isError: error,
  };
};
