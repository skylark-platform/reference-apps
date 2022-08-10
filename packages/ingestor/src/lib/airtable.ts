import { Record, FieldSet } from "airtable";
import axios from "axios";
import { Airtables } from "../interfaces";
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from "./constants";

/**
 * getTable - fetches a table from Airtable and filters empty rows
 * @param name - the table name
 * @returns table contents
 */
const getTable = async (name: string, offset = ""): Promise<Record<FieldSet>[]> => {
  try {
    const res = await axios.get<{ records: Record<FieldSet>[], offset?: string }>(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${name}?offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );
    const dataWithoutEmptyRecords = res.data.records.filter(
      ({ id, fields }) =>
        !(
          fields &&
          id !== "" &&
          Object.keys(fields).length === 0 &&
          Object.getPrototypeOf(fields) === Object.prototype
        )
    );

    const parsedRecords: Record<FieldSet>[] = dataWithoutEmptyRecords.map((records) => ({
      ...records,
      _table: {
        name
      }
    })) as Record<FieldSet>[]

    if(res.data.offset) {
      const otherRecords = await getTable(name, res.data.offset);
      return [...parsedRecords, ...otherRecords];
    }

    return parsedRecords;
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
    "Media Content",
    "roles",
    "people",
    "credits",
    "genres",
    "themes",
    "ratings",
    "assets",
    "images",
    "availibility",
    "sets-metadata",
    "asset-types",
    "image-types",
  ];
  const [
    brands,
    seasons,
    episodes,
    movies,
    mediaObjects,
    roles,
    people,
    credits,
    genres,
    themes,
    ratings,
    assets,
    images,
    availibility,
    setsMetadata,
    assetTypes,
    imageTypes,
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
    mediaObjects,
    roles,
    people,
    credits,
    genres,
    themes,
    ratings,
    assets,
    images,
    availibility,
    setsMetadata,
    assetTypes,
    imageTypes,
  };
};
