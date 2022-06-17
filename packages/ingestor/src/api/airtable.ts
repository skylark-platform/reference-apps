import Airtable from "airtable";
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from "../constants";

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

const getTable = async (name: string) => {
  const table = base(name);
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
};

export const getAllTables = async () => {
  const tables = [
    "brands",
    "seasons",
    "episodes",
    "movies",
    "roles",
    "people",
    "credits",
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
    setsMetadata,
  };
};
