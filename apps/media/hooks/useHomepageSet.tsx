import axios from "axios";
import useSWR from "swr";
import {
  SKYLARK_API,
  parseSkylarkObject,
  AllEntertainment,
  ApiMultipleEntertainmentObjects,
  createSkylarkRequestQueryAndHeaders,
  Dimensions,
} from "@skylark-reference-apps/lib";
import { useDimensions } from "@skylark-reference-apps/react";
import { useEffect, useState } from "react";

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
          slug: {},
        },
        self: {},
        episode_number: {},
        slug: {},
      },
    },
  },
};

const homepageSwrKey = "homepage-set";
export const homepageSlug = "media-reference-homepage";

export const homepageSetFetcher = (
  [, dimensions]: [key: string, dimensions: Dimensions]
) => {
  const { query, headers } = createSkylarkRequestQueryAndHeaders({
    fieldsToExpand,
    fields,
    dimensions,
  });

  return axios
    .get<ApiMultipleEntertainmentObjects>(
      `${SKYLARK_API}/api/sets/?slug=${homepageSlug}&set_type_slug=homepage&${query}`,
      { headers }
    )
    .then(({ data }) => {
      const {
        objects: [homepage],
      } = data;
      return parseSkylarkObject(homepage);
    });
};

export const useHomepageSet = () => {
  const [homepageData, setHomepageData] = useState<AllEntertainment | undefined>();
  const { dimensions } = useDimensions();
  console.log("dimensions", dimensions)

  const { data, error } = useSWR<AllEntertainment, Error>(
    [homepageSwrKey, dimensions],
    homepageSetFetcher
  );

  useEffect(() => {
    if (data)
      setHomepageData(data);
  }, [data])

  return {
    homepage: data,
    isLoading: !error && !homepageData,
    isError: error,
  };
};
