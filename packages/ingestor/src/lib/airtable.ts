import Airtable, { Error } from "airtable";
import { Airtables } from "../interfaces";
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from "./constants";

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

/**
 * getTable - fetches a table from Airtable and filters empty rows
 * @param name - the table name
 * @returns table contents
 */
const getTable = async (name: string) => {
  const table = base(name);
  try {
    const data = await table.select().all();
    const dataWithoutEmptyRecords = data.filter(
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
    if ((err as Error).statusCode === 404) {
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
    "sets-metadata",
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
    setsMetadata,
  ] = await Promise.all(tables.map((table) => getTable(table)));
  return {
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
    setsMetadata,
  };
};
