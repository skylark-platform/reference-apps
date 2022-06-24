import { FieldSet, Record } from "airtable";
import axios, { AxiosError } from "axios";
import { Airtables } from "../interfaces";
import { getAllTables } from "./airtable";

jest.mock("axios");
jest.mock("./constants", () => ({
  AIRTABLE_API_KEY: "api-key",
  AIRTABLE_BASE_ID: "base-id",
}));

describe("airtable", () => {
  let mockedGet: jest.Mock;

  beforeEach(() => {
    mockedGet = axios.get as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTables", () => {
    it("fetches all the known tables from Airtable", async () => {
      // Arrange.
      mockedGet.mockResolvedValue({ data: { records: [] } });
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

      // Act.
      await getAllTables();

      // Assert.
      expect(mockedGet).toBeCalledWith(
        "https://api.airtable.com/v0/base-id/brands",
        { headers: { Authorization: "Bearer api-key" } }
      );
      expect(mockedGet).toBeCalledTimes(Object.keys(tables).length);
    });

    it("returns the fields from records returned by Airtable", async () => {
      // Arrange.
      const fields: FieldSet[] = [
        { name: "record1", slug: "record-1" },
        { name: "record2", slug: "record-2" },
      ];
      const records: Partial<Record<FieldSet>>[] = [
        { fields: fields[0] },
        { fields: fields[1] },
      ];
      mockedGet.mockResolvedValue({ data: { records } });

      // Act.
      const data = await getAllTables();

      // Assert.
      expect(data.brands).toEqual(records);
    });

    it("filters out empty records", async () => {
      // Arrange.
      const fields: FieldSet[] = [
        { name: "record1", slug: "record-1" },
        {},
        { name: "record2", slug: "record-2" },
      ];
      const records: Partial<Record<FieldSet>>[] = [
        { fields: fields[0] },
        { fields: fields[1] },
        { fields: fields[2] },
      ];
      mockedGet.mockResolvedValue({ data: { records } });

      // Act.
      const data = await getAllTables();

      // Assert.
      expect(data.brands).toEqual([
        { fields: fields[0] },
        { fields: fields[2] },
      ]);
    });

    it("catches a 404 from Airtable, returns an empty array and logs a warn", async () => {
      // Arrange.
      // eslint-disable-next-line no-console
      console.warn = jest.fn();
      const mockedIsAxiosError = axios.isAxiosError as unknown as jest.Mock;
      mockedIsAxiosError.mockReturnValue(true);
      const err = {
        response: { status: 404 },
      } as AxiosError;

      mockedGet.mockRejectedValue(err);

      // Act.
      await getAllTables();

      // Assert.
      // eslint-disable-next-line no-console
      expect(console.warn).toBeCalledWith(
        `warn: Table "brands" does not exist`
      );
    });

    it("throws an error when the Axios response is not a 404", async () => {
      // Arrange.
      // eslint-disable-next-line no-console
      console.warn = jest.fn();
      const mockedIsAxiosError = axios.isAxiosError as unknown as jest.Mock;
      mockedIsAxiosError.mockReturnValue(true);
      const err = {
        response: { status: 500 },
      } as AxiosError;

      mockedGet.mockRejectedValue(err);

      // Act.
      await expect(getAllTables()).rejects.toEqual(err);
    });
  });
});
