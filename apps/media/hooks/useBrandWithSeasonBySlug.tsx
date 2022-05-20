import {
  createSkylarkApiQuery,
  SKYLARK_API,
  CompleteApiEntertainmentObject,
  parseSkylarkObject,
  AllEntertainment,
  Brand,
} from "@skylark-reference-apps/lib";
import useSWR from "swr";

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

const apiQuery = createSkylarkApiQuery({
  fieldsToExpand,
  fields,
});

export const objectWithItemsFetcher = (slug: string) =>
  fetch(`${SKYLARK_API}/api/brands/?slug=${slug}&${apiQuery}`, {
    cache: "no-store",
  })
    .then((r) => r.json())
    .then((res: { objects: CompleteApiEntertainmentObject[] }) =>
      parseSkylarkObject(res.objects[0])
    );

export const useBrandWithSeasonBySlug = (
  slug: string,
  initial?: AllEntertainment
) => {
  console.log(apiQuery);

  const { data, error } = useSWR<AllEntertainment, Error>(
    slug,
    objectWithItemsFetcher,
    { fallbackData: initial }
  );

  return {
    brand: data as Brand,
    error,
  };
};
