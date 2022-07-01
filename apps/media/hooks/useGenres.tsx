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

export const themeGenresFetcher = (endpoint: "genres" | "themes") => {
  const apiQuery = createSkylarkApiQuery({
    fieldsToExpand: {},
    fields,
  });
  return axios
    .get<{ objects: ApiThemeGenre[] }>(
      `${SKYLARK_API}/api/${endpoint}/?order=name&${apiQuery}`,
      {
        headers: { "Accept-Language": "en-gb" },
      }
    )
    .then(({ data }) => data.objects);
};

export const useAllGenres = () => {
  const { data, error } = useSWR<ApiThemeGenre[], Error>(
    ["genres"],
    themeGenresFetcher
  );

  return {
    genres: data,
    isLoading: !error && !data,
    isError: error,
  };
};
