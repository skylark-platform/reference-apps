import {
  createSkylarkRequestQueryAndHeaders,
  SKYLARK_API,
  parseSkylarkObject,
  AllEntertainment,
  Set,
  ApiMultipleEntertainmentObjects,
  Dimensions,
} from "@skylark-reference-apps/lib";
import useSWR from "swr";
import axios from "axios";
import { useDimensions } from "@skylark-reference-apps/react";

const fieldsToExpand = {
  image_urls: {},
  credits: {
    role_url: {},
    people_url: {},
  },
  items: {
    content_url: {
      image_urls: {},
    },
  },
  rating_urls: {},
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
  credits: {
    character: {},
    role_url: {
      title: {},
    },
    people_url: {
      name: {},
    },
  },
  rating_urls: {
    title: {},
    slug: {},
  },
  items: {
    content_url: {
      self: {},
      slug: {},
      title: {},
      image_urls: {
        self: {},
        url: {},
        url_path: {},
        image_type: {},
      },
      title_short: {},
      title_medium: {},
      synopsis_short: {},
      synopsis_medium: {},
      season_number: {},
      episode_number: {},
      release_date: {},
      items: {
        self: {},
        slug: {},
        title: {},
        image_urls: {
          self: {},
          url: {},
          url_path: {},
          image_type: {},
        },
        title_short: {},
        title_medium: {},
        synopsis_short: {},
        synopsis_medium: {},
        episode_number: {},
      },
    },
  },
};

export const setFetcher = ([slug, dimensions]: [
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
      `${SKYLARK_API}/api/sets/?slug=${slug}&${query}`,
      { headers }
    )
    .then(({ data }) => {
      const { objects } = data;
      if (!objects || objects.length === 0) {
        throw new Error("Set not found");
      }
      return objects;
    })
    .then(([brand]: ApiMultipleEntertainmentObjects["objects"]) =>
      parseSkylarkObject(brand)
    );
};

export const useSlider = (slug: string) => {
  const { dimensions } = useDimensions();

  const { data, error } = useSWR<AllEntertainment, Error>(
    [slug, dimensions],
    setFetcher
  );

  return {
    slider: data as Set | undefined,
    isLoading: !error && !data,
    notFound: error?.message === "Set not found",
    error,
  };
};
