import {
  ApiSetItem,
  ApiEntertainmentObject,
  SetTypes,
} from "@skylark-reference-apps/lib";
import axios from "axios";
import { isEmpty } from "lodash";
import { authenticatedSkylarkRequest } from "./api";

/**
 * getResources - Queries a Skylark resource
 * @param resource - the Skylark API resource to query
 * @returns array of resources
 */
export const getResources = async <T>(resource: string): Promise<T[]> => {
  const res = await authenticatedSkylarkRequest<{ objects?: T[] }>(
    `/api/${resource}/`,
    { method: "GET" }
  );
  return res.data?.objects || [];
};

/**
 * getResourceByDataSourceId - Queries a Skylark resource using its data_source_id
 * @param resource - the Skylark API resource to query
 * @param value - the data source ID
 * @returns The object returned, null if it doesn't exist
 */
export const getResourceByDataSourceId = async <T>(
  resource: string,
  dataSourceId: string
) => {
  try {
    const res = await authenticatedSkylarkRequest<T>(
      `/api/${resource}/versions/data-source/${dataSourceId}/`,
      {
        method: "GET",
        params: {
          all: true,
        },
      }
    );
    return isEmpty(res.data) ? null : res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

/**
 * getResourceByProperty - Queries a Skylark resource using a given property
 * @param resource - the Skylark API resource to query
 * @param property - the resource property to query
 * @param value - the query
 * @returns The first object returned, otherwise null if none are found
 */
export const getResourceByProperty = async <T>(
  resource: string,
  property: string,
  value: string
) => {
  const res = await authenticatedSkylarkRequest<{ objects?: T[] }>(
    `/api/${resource}/?${property}=${value}`,
    {
      method: "GET",
      params: {
        all: true,
      },
    }
  );
  return res.data.objects?.[0] || null;
};

/**
 * Wrapper function to query a Skylark resource using the slug property
 */
export const getResourceBySlug = <T>(resource: string, slug: string) =>
  getResourceByProperty<T>(resource, "slug", slug);

/**
 * Wrapper function to query a Skylark resource using the title property
 */
export const getResourceByTitle = <T>(resource: string, title: string) =>
  getResourceByProperty<T>(resource, "title", title);

/**
 * Wrapper function to query a Skylark resource using the name property
 */
export const getResourceByName = <T>(resource: string, name: string) =>
  getResourceByProperty<T>(resource, "name", name);

/**
 * getSetBySlug - Queries a Skylark set using a slug
 * @param setType - the set type
 * @param slug - query slug
 * @returns The first object returned, otherwise null if none are found
 */
export const getSetBySlug = async (
  setType: SetTypes,
  slug: string
): Promise<ApiEntertainmentObject | null> => {
  const res = await authenticatedSkylarkRequest<{
    objects?: ApiEntertainmentObject[];
  }>(`/api/sets/?set_type_slug=${setType}&slug=${slug}`, {
    method: "GET",
    params: {
      all: true,
    },
  });

  return res.data.objects?.[0] || null;
};

/**
 * getSetItems - Gets the items for a set using its ID
 * Uses the cms-sets endpoint so that dynamic objects are not expanded
 * @param setUid - Set ID
 * @returns set items
 */
export const getSetItems = async (setUid: string) => {
  const url = `/api/cms-sets/${setUid}/items/`;
  const res = await authenticatedSkylarkRequest<{ objects?: ApiSetItem[] }>(
    url,
    {
      method: "GET",
      params: {
        all: true,
      },
    }
  );
  return res.data?.objects || [];
};
