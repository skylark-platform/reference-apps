import useSWR from "swr";
import {
  createSkylarkApiQuery,
  SKYLARK_API,
  ApiEntertainmentObject,
  parseSkylarkObject,
  AllEntertainment,
} from "@skylark-reference-apps/lib";

const fieldsToExpand = {
  items: {
    content_url: {
      items: {
        content_url: {
          image_urls: {},
        },
        image_urls: {},
      },
    },
  },
};

const fields = {
  items: {
    content_url: {
      title: {},
      set_type_slug: {},
      self: {},
      title_short: {},
      title_medium: {},
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
          episode_number: {},
        },
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

const apiQuery = createSkylarkApiQuery({
  fieldsToExpand,
  fields,
});

const homepageSwrKey = "homepage-set";
const homepageSlug = "media-reference-homepage";

export const homepageSetFetcher = () =>
  fetch(
    `${SKYLARK_API}/api/sets/?slug=${homepageSlug}&set_type_slug=homepage&${apiQuery}`,
    {
      cache: "no-store",
    }
  )
    .then((r) => r.json())
    .then((res: { objects: ApiEntertainmentObject[] }) => parseSkylarkObject(res.objects[0]));

export const useHomepageSet = (initial: AllEntertainment) => {
  const { data, error } = useSWR<AllEntertainment, Error>(
    homepageSwrKey,
    homepageSetFetcher,
    { fallbackData: initial }
  );
  console.log("data", data);

  return {
    homepage: data,
    isLoading: !error && !data,
    isError: error,
  };
};
