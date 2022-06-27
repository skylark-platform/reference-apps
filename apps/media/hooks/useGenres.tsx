import useSWR from "swr";
import {
  createSkylarkApiQuery,
  SKYLARK_API,
  ApiThemeGenre,
} from "@skylark-reference-apps/lib";
import axios from "axios";

const fields = {
  name: {},
  uid: {},
};

export const genresSetFetcher = (endpoint: string) => {
  const apiQuery = createSkylarkApiQuery({
    fieldsToExpand: {},
    fields,
  });
  return axios
    .get<{ objects: ApiThemeGenre[] }>(
      `${SKYLARK_API}/api/${endpoint}/?${apiQuery}`,
      {
        headers: { "Accept-Language": "en-gb" },
      }
    )
    .then(({ data }) => data.objects);
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
