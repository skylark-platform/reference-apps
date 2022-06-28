import { Record, FieldSet } from "airtable";
import axios from "axios";
import { Airtables } from "../interfaces";
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from "./constants";

/**
 * getTable - fetches a table from Airtable and filters empty rows
 * @param name - the table name
 * @returns table contents
 */
const getTable = async (name: string): Promise<Record<FieldSet>[]> => {
  try {
    const res = await axios.get<{ records: Record<FieldSet>[] }>(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${name}`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );
    const dataWithoutEmptyRecords = res.data.records.filter(
      ({ fields }) =>
        !(
          fields &&
          Object.keys(fields).length === 0 &&
          Object.getPrototypeOf(fields) === Object.prototype
        )
    );
    return dataWithoutEmptyRecords;
  } catch (err) {
    // If table is not found, log warning but return empty array
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      // eslint-disable-next-line no-console
      console.warn(`warn: Table "${name}" does not exist`);
      return [];
    }
    throw err;
  }
};

/**
 * Fetches and returns the tables from Airtable
 * @returns Object containing Airtable tables
 */
export const getAllTables = async (): Promise<Airtables> => {
  const dimensionTables = [
    "affiliates",
    "customer-types",
    "device-types",
    "languages",
    "locales",
    "operating-systems",
    "regions",
    "viewing-context",
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
  ] = await Promise.all(dimensionTables.map((table) => getTable(table)));

  const tables = [
    "brands",
    "seasons",
    "episodes",
    "movies",
    "roles",
    "people",
    "credits",
    "genres",
    "themes",
    "ratings",
    "images",
    "availibility",
    "sets-metadata",
    "asset-types",
  ];
  const [
    brands,
    seasons,
    episodes,
    movies,
    roles,
    people,
    credits,
    genres,
    themes,
    ratings,
    images,
    availibility,
    setsMetadata,
    assetTypes,
  ] = await Promise.all(tables.map((table) => getTable(table)));

  return {
    dimensions: {
      affiliates,
      customerTypes,
      deviceTypes,
      languages,
      locales,
      operatingSystems,
      regions,
      viewingContext,
    },
    brands,
    seasons,
    episodes,
    movies,
    roles,
    people,
    credits,
    genres,
    themes,
    ratings,
    images,
    availibility,
    setsMetadata,
    assetTypes,
  };
};
