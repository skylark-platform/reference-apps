import useSWR from "swr";
import {
  createSkylarkApiQuery,
  SKYLARK_API,
  parseSkylarkObject,
  AllEntertainment,
  EntertainmentType,
  convertObjectTypeToSkylarkEndpoint,
  ApiMultipleEntertainmentObjects,
} from "@skylark-reference-apps/lib";

const fieldsToExpand = {
  parent_url: {
    parent_url: {},
  },
  image_urls: {},
  credits: {
    role_url: {},
    people_url: {},
  },
  rating_urls: {},
  theme_urls: {},
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
  episode_number: {},
  credits: {
    character: {},
    role_url: {
      title: {},
    },
    people_url: {
      name: {},
    },
  },
  parent_url: {
    self: {},
    title: {},
    title_short: {},
    title_medium: {},
    title_long: {},
    parent_url: {
      self: {},
      title: {},
      title_short: {},
      title_medium: {},
      title_long: {},
    },
  },
  rating_urls: {
    title: {},
    value: {},
  },
  theme_urls: {
    name: {},
  },
};

const apiQuery = createSkylarkApiQuery({
  fieldsToExpand,
  fields,
});

const singleObjectFetcher = ([endpoint, slug]: [
  endpoint: string,
  slug: string
]) =>
  fetch(`${SKYLARK_API}/api/${endpoint}/?slug=${slug}&${apiQuery}`)
    .then((r) => r.json())
    .then(({ objects: [object] }: ApiMultipleEntertainmentObjects) =>
      parseSkylarkObject(object)
    );

export const useEpisodeBySlug = (
  type: EntertainmentType,
  slug: string | undefined
) => {
  const endpoint = convertObjectTypeToSkylarkEndpoint(type);
  const { data, error } = useSWR<AllEntertainment, Error>(
    [endpoint, slug],
    singleObjectFetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
