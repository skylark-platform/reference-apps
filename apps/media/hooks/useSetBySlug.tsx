import {
  createSkylarkApiQuery,
  SKYLARK_API,
  parseSkylarkObject,
  AllEntertainment,
  Set,
  ApiMultipleEntertainmentObjects,
} from "@skylark-reference-apps/lib";
import { useDeviceType } from "@skylark-reference-apps/react/src/hooks";
import useSWR from "swr";
import axios from "axios";

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

export const setFetcher = ([slug, deviceType]: [
  slug: string,
  deviceType: string
]) => {
  const apiQuery = createSkylarkApiQuery({
    fieldsToExpand,
    fields,
    deviceTypes: [deviceType],
  });

  return axios
    .get<ApiMultipleEntertainmentObjects>(
      `${SKYLARK_API}/api/sets/?slug=${slug}&${apiQuery}`,
      { headers: { "Accept-Language": "en-gb" } }
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

export const useSetBySlug = (slug: string) => {
  const deviceType = useDeviceType();

  const { data, error } = useSWR<AllEntertainment, Error>(
    [slug, deviceType],
    setFetcher
  );

  return {
    set: data as Set | undefined,
    isLoading: !error && !data,
    notFound: error?.message === "Set not found",
    error,
  };
};
