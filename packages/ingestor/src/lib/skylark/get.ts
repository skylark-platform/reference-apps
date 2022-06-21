import {
  ApiSchedule,
  ApiImageType,
  ApiSetType,
} from "@skylark-reference-apps/lib";
import { authenticatedSkylarkRequest } from "./api";

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
 * getAlwaysSchedule - finds and returns the schedule that is always licenced
 * @returns the always schedule object
 */
export const getAlwaysSchedule = async (): Promise<ApiSchedule> => {
  const schedule = await getResourceBySlug<ApiSchedule>(
    "schedules",
    "always-licence"
  );
  if (!schedule) {
    throw new Error("Always schedule not found");
  }
  return schedule;
};

/**
 * getImageTypes - finds and returns all the image types
 * @returns the image types available in Skylark
 */
export const getImageTypes = async (): Promise<ApiImageType[]> => {
  const res = await authenticatedSkylarkRequest<{ objects: ApiImageType[] }>(
    "/api/image-types/"
  );
  return res.data.objects;
};

/**
 * getSetTypes - finds and returns all the set types
 * @returns the set types available in Skylark
 */
export const getSetTypes = async (): Promise<ApiSetType[]> => {
  const res = await authenticatedSkylarkRequest<{ objects: ApiSetType[] }>(
    "/api/set-types/"
  );
  return res.data.objects;
};
