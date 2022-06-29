import {
  DimensionTypes,
  ApiDimension,
  ApiSchedule,
} from "@skylark-reference-apps/lib";
import { Record, FieldSet } from "airtable";
import { createOrUpdateObject } from "./create";
import { Airtables, ApiAirtableFields, Metadata } from "../../interfaces";
import { getResourceBySlug } from "./get";

const convertDimensionsToUrls = (
  dimensions: (ApiDimension & ApiAirtableFields)[],
  airtableDimensionIds: string[]
) =>
  dimensions
    .filter(({ airtableId }) => airtableDimensionIds?.includes(airtableId))
    .map(({ self }) => self);

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
 * createOrUpdateDimensions - creates or updates a dimension within Skylark
 * @param type
 * @param table
 * @returns all dimensions from a given table
 */
const createOrUpdateDimensions = (
  type: DimensionTypes,
  table: Record<FieldSet>[]
) =>
  Promise.all(
    table.map(
      async ({ fields, id }): Promise<ApiDimension & ApiAirtableFields> => {
        const data = {
          name: fields.name as string,
          slug: fields.slug as string,
        };
        const createdDimension = await createOrUpdateObject<ApiDimension>(
          `dimensions/${type}`,
          { property: "slug", value: fields.slug as string },
          data,
          "PUT"
        );
        return {
          ...createdDimension,
          airtableId: id,
        };
      }
    )
  );

/**
 * createOrUpdateScheduleDimensions - creates or updates all scheduling dimensions from Airtable to Skylark
 * @param airtable
 * @returns all scheduling dimensions in the metadata object
 */
export const createOrUpdateScheduleDimensions = async (
  airtable: Airtables["dimensions"]
): Promise<Metadata["dimensions"]> => {
  const dimensions: { type: DimensionTypes; data: Record<FieldSet>[] }[] = [
    { type: "affiliates", data: airtable.affiliates },
    { type: "customer-types", data: airtable.customerTypes },
    { type: "device-types", data: airtable.deviceTypes },
    { type: "languages", data: airtable.languages },
    { type: "locales", data: airtable.locales },
    { type: "operating-systems", data: airtable.operatingSystems },
    { type: "regions", data: airtable.regions },
    { type: "viewing-context", data: airtable.viewingContext },
  ];

  const [
    affiliates,
    customerTypes,
    deviceTypes,
    languages,
    locales,
    operatingSystems,
    regions,
    viewingContext,
  ] = await Promise.all(
    dimensions.map(({ type, data }) => createOrUpdateDimensions(type, data))
  );
  return {
    affiliates,
    customerTypes,
    deviceTypes,
    languages,
    locales,
    operatingSystems,
    regions,
    viewingContext,
  };
};

/**
 * createOrUpdateSchedules - creates or updates schedules from Airtable in Skylark
 * @param schedules - schedules from Airtable
 * @param dimensions - All dimensions known in Airtable and created in Skylark
 * @returns
 */
export const createOrUpdateSchedules = (
  schedules: Record<FieldSet>[],
  dimensions: Metadata["dimensions"]
) =>
  Promise.all(
    schedules.map(
      async ({ fields, id }): Promise<ApiSchedule & ApiAirtableFields> => {
        const {
          title,
          slug,
          type,
          starts,
          ends,
          devices,
          affiliates,
          customers,
          languages,
          locales,
          "operating-systems": operatingSystems,
          regions,
          "viewing-context": viewingContext,
        } = fields as {
          title: string;
          slug: string;
          type: string;
          starts: string;
          ends: string;
          affiliates: string[];
          devices: string[];
          customers: string[];
          languages: string[];
          locales: string[];
          "operating-systems": string[];
          regions: string[];
          "viewing-context": string[];
        };
        const data: Partial<ApiSchedule> = {
          title,
          slug,
          starts,
          ends,
          rights: type === "license",
          affiliate_urls: convertDimensionsToUrls(
            dimensions.affiliates,
            affiliates
          ),
          customer_type_urls: convertDimensionsToUrls(
            dimensions.customerTypes,
            customers
          ),
          device_type_urls: convertDimensionsToUrls(
            dimensions.deviceTypes,
            devices
          ),
          language_urls: convertDimensionsToUrls(
            dimensions.languages,
            languages
          ),
          locale_urls: convertDimensionsToUrls(dimensions.locales, locales),
          operating_system_urls: convertDimensionsToUrls(
            dimensions.operatingSystems,
            operatingSystems
          ),
          region_urls: convertDimensionsToUrls(dimensions.regions, regions),
          viewing_context_urls: convertDimensionsToUrls(
            dimensions.viewingContext,
            viewingContext
          ),
        };
        const createdDimension = await createOrUpdateObject<ApiSchedule>(
          "schedules",
          { property: "slug", value: fields.slug as string },
          data,
          "PUT"
        );
        return {
          ...createdDimension,
          airtableId: id,
        };
      }
    )
  );
