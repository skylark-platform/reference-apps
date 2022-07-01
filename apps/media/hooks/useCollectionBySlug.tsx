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

export const collectionFetcher = ([slug, deviceType]: [
  slug: string,
  deviceType: string
]) => {
  const apiQuery = createSkylarkApiQuery({
    fieldsToExpand,
    fields,
    deviceTypes: [deviceType],
  });

  return fetch(
    `${SKYLARK_API}/api/sets/?slug=${slug}&set_type_slug=collection&${apiQuery}`,
    {
      headers: { "Accept-Language": "en-gb" },
    }
  )
    .then((r) => r.json())
    .then(({ objects }: ApiMultipleEntertainmentObjects) => {
      if (!objects || objects.length === 0) {
        throw new Error("Collection not found");
      }
      return objects;
    })
    .then(([item]: ApiMultipleEntertainmentObjects["objects"]) =>
      parseSkylarkObject(item)
    );
};

export const useCollectionBySlug = (slug: string) => {
  const deviceType = useDeviceType();

  const { data, error } = useSWR<AllEntertainment, Error>(
    [slug, deviceType],
    collectionFetcher
  );

  return {
    collection: data as Set | undefined,
    notFound: error?.message === "Collection not found",
    error,
  };
};
