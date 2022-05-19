import useSWR from "swr";
import {
  createSkylarkApiQuery,
  SKYLARK_API,
  CompleteApiEntertainmentObject,
  parseSkylarkObject,
  AllEntertainment,
  EntertainmentType,
  convertObjectTypeToSkylarkEndpoint,
} from "@skylark-reference-apps/lib";

const fieldsToExpand = {
  image_urls: {},
  credits: {
    role_url: {},
    people_url: {},
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
  episode_number: {},
  season_number: {},
  credits: {
    character: {},
    role_url: {
      title: {},
    },
    people_url: {
      name: {},
    },
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
  fetch(`${SKYLARK_API}/api/${endpoint}/?slug=${slug}&${apiQuery}`, {
    cache: "no-store",
  })
    .then((r) => r.json())
    .then((res: { objects: CompleteApiEntertainmentObject[] }) =>
      parseSkylarkObject(res.objects[0])
    );

export const useSingleObjectBySlug = (
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
