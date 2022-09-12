import {
  createSkylarkRequestQueryAndHeaders,
  SKYLARK_API,
  parseSkylarkObject,
  ApiMultipleEntertainmentObjects,
  EntertainmentType,
  SetTypes,
  getTitleByOrder,
  getSynopsisByOrder,
  convertObjectTypeToSkylarkEndpoint,
} from "@skylark-reference-apps/lib";
import axios from "axios";

const fieldsToExpand = {
  image_urls: {},
};

const fields = {
  title: {},
  image_urls: {
    url: {},
  },
  title_short: {},
  title_medium: {},
  title_long: {},
  synopsis_short: {},
  synopsis_medium: {},
  synopsis_long: {},
};

interface SeoObjectImage {
  url: string;
}

export interface SeoObjectData {
  title?: string;
  synopsis?: string;
  images?: SeoObjectImage[];
}

/**
 * getSeoDataFromSkylark - fetches data from Skylark which is used in SEO tags
 * @param endpoint - Skylark endpoint
 * @param query - The query used to find the object, usually contains slug
 * @returns - object used containing SEO fields
 */
const getSeoDataFromSkylark = async (
  endpoint: string,
  query: string,
  locale: string
): Promise<SeoObjectData> => {
  const { query: apiQuery, headers } = createSkylarkRequestQueryAndHeaders({
    fieldsToExpand,
    fields,
    dimensions: {
      language: locale || "",
      customerType: "",
      deviceType: "",
    },
  });

  const {
    data: { objects },
  } = await axios.get<ApiMultipleEntertainmentObjects>(
    `${SKYLARK_API}${endpoint}?${apiQuery}${`&${query}` || ""}`,
    {
      headers,
    }
  );

  if (!objects || objects.length === 0) {
    return {};
  }

  const { title, objectTitle, synopsis, ...object } = parseSkylarkObject(
    objects[0]
  );

  const images = object.images?.isExpanded
    ? object.images.items.map(
        (image): SeoObjectImage => ({
          url: `${image.url}-100x100`,
        })
      )
    : undefined;

  return {
    title: getTitleByOrder(title, ["long", "medium", "short"], objectTitle),
    synopsis: getSynopsisByOrder(synopsis, ["short", "medium", "long"]),
    images,
  };
};

/**
 * getSeoDataForObject - returns SEO data for an object
 * @param type - type of object
 * @param slug - slug to find object
 * @returns - object used containing SEO fields
 */
export const getSeoDataForObject = (
  type: EntertainmentType,
  slug: string,
  locale: string
): Promise<SeoObjectData> => {
  const endpointType = convertObjectTypeToSkylarkEndpoint(type);
  return getSeoDataFromSkylark(`/api/${endpointType}`, `slug=${slug}`, locale);
};

/**
 * getSeoDataForSet - returns SEO data for a set
 * @param setType - set type
 * @param slug - slug to find set
 * @returns - object used containing SEO fields
 */
export const getSeoDataForSet = (
  setType: SetTypes,
  slug: string,
  locale: string
): Promise<SeoObjectData> => {
  const setTypeSlug = convertObjectTypeToSkylarkEndpoint(setType);
  return getSeoDataFromSkylark(
    `/api/sets`,
    `set_type_slug=${setTypeSlug}&slug=${slug}`,
    locale
  );
};
