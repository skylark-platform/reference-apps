import { Airtables } from "../interfaces";
import { getAllTables } from "./airtable";

jest.mock("airtable");
jest.mock("@skylark-reference-apps/lib", () => ({
  AIRTABLE_API_KEY: "api-key",
  AIRTABLE_BASE_ID: "base-id",
}));

describe.skip("airtable", () => {
  let mockedBase: jest.Mock;

  beforeEach(() => {
    // const base = new Airtable({ apiKey: "api-key" }).base
    // // mockedBase = base as jest.Mock;
    // mockedBase = jest.mock(Airtable.Table.prototype.select);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTables", () => {
    it("fetches all the known tables from Airtable", async () => {
      const tables: Airtables = {
        brands: [],
        seasons: [],
        episodes: [],
        movies: [],
        roles: [],
        people: [],
        credits: [],
        genres: [],
        themes: [],
        ratings: [],
        setsMetadata: [],
      };
      await getAllTables();

      expect(mockedBase).toBeCalledTimes(Object.keys(tables).length);
    });
  });
});
