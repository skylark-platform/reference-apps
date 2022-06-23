import useSWR from "swr";
import {
  createSkylarkApiQuery,
  SKYLARK_API,
  ApiThemeGenre,
} from "@skylark-reference-apps/lib";

const fields = {
  name: {},
  uid: {},
};

export const genresSetFetcher = (endpoint: string) => {
  const apiQuery = createSkylarkApiQuery({
    fieldsToExpand: {},
    fields,
  });

  // use axios here
  return fetch(`${SKYLARK_API}/api/${endpoint}/?${apiQuery}`, {
    headers: { "Accept-Language": "en-gb" },
  })
    .then((r) => r.json())
    .then(({ objects: genres }) => genres as ApiThemeGenre[]);
};

export const useAllGenres = (type: string) => {
  const { data, error } = useSWR<ApiThemeGenre[], Error>(
    [type],
    genresSetFetcher
  );

  return {
    genres: data,
    isLoading: !error && !data,
    isError: error,
  };
};
