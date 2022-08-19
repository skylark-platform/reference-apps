import axios from "axios";
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
        content_url: {},
      },
    },
  },
};

const fields = {
  items: {
    content_url: {
      title: {},
      slug: {},
      set_type_slug: {},
      self: {},
      title_short: {},
      title_medium: {},
      items: {
        content_url: {
          self: {},
        },
        self: {},
      },
    },
  },
};

const homepageSwrKey = "homepage-set";
export const homepageSlug = "media-reference-homepage";

export const homepageSetFetcher = (
  params?: [key: string, deviceType: string]
) => {
  const apiQuery = createSkylarkApiQuery({
    fieldsToExpand,
    fields,
    deviceTypes: params?.[1] ? [params?.[1]] : [],
  });

  return axios
    .get<ApiMultipleEntertainmentObjects>(
      `${SKYLARK_API}/api/sets/?slug=${homepageSlug}&set_type_slug=homepage&${apiQuery}`,
      { headers: { "Accept-Language": "en-gb" } }
    )
    .then(({ data }) => {
      const {
        objects: [homepage],
      } = data;
      return parseSkylarkObject(homepage);
    });
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
