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
    content_url: {},
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
    },
  },
};

export const collectionFetcher = ([slug, dimensions]: [
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
      `${SKYLARK_API}/api/sets/?slug=${slug}&set_type_slug=collection&${query}`,
      { headers }
    )
    .then(({ data }) => {
      const { objects } = data;
      if (!objects || objects.length === 0) {
        throw new Error("Collection not found");
      }
      return objects;
    })
    .then(([brand]: ApiMultipleEntertainmentObjects["objects"]) =>
      parseSkylarkObject(brand)
    );
};

export const useCollectionBySlug = (slug: string) => {
  const { dimensions } = useDimensions();

  const { data, error } = useSWR<AllEntertainment, Error>(
    [slug, dimensions],
    collectionFetcher
  );

  return {
    collection: data as Set | undefined,
    notFound: error?.message === "Collection not found",
    error,
  };
};
