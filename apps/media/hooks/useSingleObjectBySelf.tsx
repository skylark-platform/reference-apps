import axios from "axios";
import useSWR from "swr";
import {
  createSkylarkApiQuery,
  SKYLARK_API,
  parseSkylarkObject,
  AllEntertainment,
  ApiEntertainmentObject,
} from "@skylark-reference-apps/lib";

const fieldsToExpand = {
  parent_url: {
    parent_url: {},
  },
  image_urls: {},
  credits: {
    role_url: {},
    people_url: {},
  },
  rating_urls: {},
  theme_urls: {},
  genre_urls: {},
  items: {},
};

const fields = {
  self: {},
  title: {},
  image_urls: {
    self: {},
    url: {},
    url_path: {},
    image_type: {},
  },
  title_short: {},
  title_medium: {},
  title_long: {},
  synopsis_short: {},
  synopsis_medium: {},
  synopsis_long: {},
  episode_number: {},
  season_number: {},
  release_date: {},
  credits: {
    character: {},
    role_url: {
      title: {},
    },
    people_url: {
      name: {},
    },
  },
  parent_url: {
    self: {},
    title: {},
    title_short: {},
    title_medium: {},
    title_long: {},
    season_number: {},
    release_date: {},
    parent_url: {
      self: {},
      title: {},
      title_short: {},
      title_medium: {},
      title_long: {},
    },
  },
  rating_urls: {
    title: {},
    value: {},
  },
  theme_urls: {
    name: {},
  },
  genre_urls: {
    name: {},
  },
  items: {},
};

const apiQuery = createSkylarkApiQuery({
  fieldsToExpand,
  fields,
});

export const singleObjectFetcher = ([endpoint]: [endpoint: string]) =>
  axios
    .get<ApiEntertainmentObject>(`${SKYLARK_API}${endpoint}/?${apiQuery}`, {
      headers: { "Accept-Language": "en-gb" },
    })
    .then(({ data }) => {
      console.log("## data", data);

      return parseSkylarkObject(data);
    });

export const useSingleObjectBySelf = (self: string) => {
  const { data, error } = useSWR<AllEntertainment, Error>(
    [self],
    singleObjectFetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
