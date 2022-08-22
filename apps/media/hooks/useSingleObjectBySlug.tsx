import axios from "axios";
import useSWR from "swr";
import {
  createSkylarkApiQuery,
  SKYLARK_API,
  parseSkylarkObject,
  AllEntertainment,
  EntertainmentType,
  convertObjectTypeToSkylarkEndpoint,
  ApiMultipleEntertainmentObjects,
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

export const singleObjectFetcher = ([endpoint, slug]: [
  endpoint: string,
  slug: string
]) =>
  axios
    .get<ApiMultipleEntertainmentObjects>(
      `${SKYLARK_API}/api/${endpoint}/?slug=${slug}&${apiQuery}`,
      { headers: { "Accept-Language": "en-gb" } }
    )
    .then(({ data }) => {
      const {
        objects: [object],
      } = data;
      return parseSkylarkObject(object);
    });

export const useSingleObjectBySlug = (
  type: EntertainmentType | null,
  slug: string | undefined
) => {
  const endpoint = (type && convertObjectTypeToSkylarkEndpoint(type)) || "sets";

  const { data, error } = useSWR<AllEntertainment, Error>(
    [endpoint, slug],
    singleObjectFetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
