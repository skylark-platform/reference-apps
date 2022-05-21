import useSWR from "swr";
import {
  createSkylarkApiQuery,
  SKYLARK_API,
  parseSkylarkObject,
  AllEntertainment,
  ApiMultipleEntertainmentObjects,
} from "@skylark-reference-apps/lib";
import { useDeviceType } from "@skylark-reference-apps/react/src/hooks";

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

const homepageSwrKey = "homepage-set";
const homepageSlug = "media-reference-homepage";

export const homepageSetFetcher = (
  params?: [key: string, deviceType: string]
) => {
  const apiQuery = createSkylarkApiQuery({
    fieldsToExpand,
    fields,
    deviceTypes: params?.[1] ? [params?.[1]] : [],
  });

  return fetch(
    `${SKYLARK_API}/api/sets/?slug=${homepageSlug}&set_type_slug=homepage&${apiQuery}`
  )
    .then((r) => r.json())
    .then(({ objects: [homepage] }: ApiMultipleEntertainmentObjects) =>
      parseSkylarkObject(homepage)
    );
};

export const useHomepageSet = () => {
  const deviceType = useDeviceType();

  const { data, error } = useSWR<AllEntertainment, Error>(
    [homepageSwrKey, deviceType],
    homepageSetFetcher
  );

  return {
    homepage: data,
    isLoading: !error && !data,
    isError: error,
  };
};
