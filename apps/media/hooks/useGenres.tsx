import useSWR from "swr";
import {
  createSkylarkRequestQueryAndHeaders,
  SKYLARK_API,
  ApiThemeGenre,
  Dimensions,
} from "@skylark-reference-apps/lib";
import axios from "axios";

const fields = {
  name: {},
  uid: {},
};

export const themeGenresFetcher = ([endpoint, dimensions]: [
  endpoint: "genres" | "themes",
  dimensions: Dimensions
]) => {
  const { query, headers } = createSkylarkRequestQueryAndHeaders({
    fieldsToExpand: {},
    fields,
    dimensions,
  });
  return axios
    .get<{ objects: ApiThemeGenre[] }>(
      `${SKYLARK_API}/api/${endpoint}/?order=name&${query}`,
      {
        headers,
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
