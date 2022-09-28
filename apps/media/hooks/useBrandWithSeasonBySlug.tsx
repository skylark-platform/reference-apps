import axios from "axios";
import useSWR from "swr";
import {
  createSkylarkRequestQueryAndHeaders,
  SKYLARK_API,
  parseSkylarkObject,
  AllEntertainment,
  Brand,
  ApiMultipleEntertainmentObjects,
  Dimensions,
} from "@skylark-reference-apps/lib";
import { useDimensions } from "@skylark-reference-apps/react";

const fieldsToExpand = {
  image_urls: {},
  credits: {
    role_url: {},
    people_url: {},
  },
  items: {
    image_urls: {},
    items: {
      image_urls: {},
    },
  },
  rating_urls: {},
  tags: {},
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
  tags: {
    name: {},
  },
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
    season_number: {},
    episode_number: {},
    release_date: {},
    items: {
      self: {},
      slug: {},
      episode_number: {},
    },
  },
};

export const brandWithSeasonFetcher = ([slug, dimensions]: [
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
      `${SKYLARK_API}/api/brands/?slug=${slug}&${query}`,
      { headers }
    )
    .then(({ data }) => {
      const { objects } = data;
      if (!objects || objects.length === 0) {
        throw new Error("Brand not found");
      }
      return objects;
    })
    .then(([brand]: ApiMultipleEntertainmentObjects["objects"]) =>
      parseSkylarkObject(brand)
    );
};

export const useBrandWithSeasonBySlug = (slug: string) => {
  const { dimensions } = useDimensions();

  const { data, error } = useSWR<AllEntertainment, Error>(
    [slug, dimensions],
    brandWithSeasonFetcher
  );

  return {
    brand: data as Brand | undefined,
    error,
  };
};
