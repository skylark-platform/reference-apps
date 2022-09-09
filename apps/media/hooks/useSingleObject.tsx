import axios from "axios";
import useSWR from "swr";
import {
  createSkylarkRequestQueryAndHeaders,
  SKYLARK_API,
  parseSkylarkObject,
  AllEntertainment,
  EntertainmentType,
  convertObjectTypeToSkylarkEndpoint,
  ApiMultipleEntertainmentObjects,
  Dimensions,
} from "@skylark-reference-apps/lib";
import { useDimensions } from "@skylark-reference-apps/react";

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
  slug: {},
  set_type_slug: {},
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


export const singleObjectFetcher = ([endpoint, slug, dimensions]: [
  endpoint: string,
  slug: string,
  dimensions: Dimensions
]) => {
  const { query, headers } = createSkylarkRequestQueryAndHeaders({
    fieldsToExpand,
    fields,
    dimensions,
  });

  return axios
    .get<ApiMultipleEntertainmentObjects>(
      `${SKYLARK_API}/api/${endpoint}/?slug=${slug}&${query}`,
      { headers }
    )
    .then(({ data }) => {
      const {
        objects: [object],
      } = data;
      return parseSkylarkObject(object);
    });
}

export const useSingleObject = (
  type: EntertainmentType | null,
  slug: string | undefined
) => {
  const endpoint = (type && convertObjectTypeToSkylarkEndpoint(type)) || "sets";
  const { dimensions } = useDimensions();

  const { data, error } = useSWR<AllEntertainment, Error>(
    [endpoint, slug, dimensions],
    singleObjectFetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
