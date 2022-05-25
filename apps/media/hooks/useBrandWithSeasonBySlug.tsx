import axios from "axios";
import useSWR from "swr";
import {
  createSkylarkApiQuery,
  SKYLARK_API,
  parseSkylarkObject,
  AllEntertainment,
  Brand,
  ApiMultipleEntertainmentObjects,
} from "@skylark-reference-apps/lib";
import { useDeviceType } from "@skylark-reference-apps/react/src/hooks";

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
    year: {},
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
};

export const brandWithSeasonFetcher = ([slug, deviceType]: [
  slug: string,
  deviceType: string
]) => {
  const apiQuery = createSkylarkApiQuery({
    fieldsToExpand,
    fields,
    deviceTypes: [deviceType],
  });

<<<<<<< HEAD
  return fetch(`${SKYLARK_API}/api/brands/?slug=${slug}&${apiQuery}`, {
    headers: { "Accept-Language": "en-gb" },
  })
    .then((r) => r.json())
    .then(({ objects }: ApiMultipleEntertainmentObjects) => {
=======
  return axios
    .get<ApiMultipleEntertainmentObjects>(
      `${SKYLARK_API}/api/brands/?slug=${slug}&${apiQuery}`,
      { headers: { "Accept-Language": "en-gb" }, }
    )
    .then(({ data }) => {
      const { objects } = data;
>>>>>>> 56169c7 (feat: add axios)
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
  const deviceType = useDeviceType();

  const { data, error } = useSWR<AllEntertainment, Error>(
    [slug, deviceType],
    brandWithSeasonFetcher
  );

  return {
    brand: data as Brand | undefined,
    notFound: error?.message === "Brand not found",
    error,
  };
};
