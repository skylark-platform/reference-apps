/**
 * @jest-environment node
 */
import { Dimensions } from "@skylark-reference-apps/lib";
import axios from "axios";
import { collectionFetcher } from "../../hooks/useCollectionBySlug";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const slug = "this-is-a-slug";
const successResponse = {
  credits: undefined,
  genres: undefined,
  images: undefined,
  isExpanded: true,
  items: undefined,
  objectTitle: "",
  parent: undefined,
  ratings: undefined,
  releaseDate: "",
  self: "",
  slug: "",
  synopsis: { long: "", medium: "", short: "" },
  tags: [],
  themes: undefined,
  title: { long: "", medium: "", short: "" },
  titleSort: "",
  type: null,
  uid: "",
};

describe("collectionFetcher hook tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds the Skylark Dimension Settings to the request", async () => {
    // Act
    mockedAxios.get.mockResolvedValueOnce({ data: { objects: "mockData" } });
    await collectionFetcher([
      "key",
      {
        language: "pt-pt",
        deviceType: "pc",
        customerType: "standard",
      } as Dimensions,
    ]);
    // Assert
    expect(mockedAxios.get).toBeCalledWith(
      expect.stringContaining("device_types=pc&customer_types=standard"),
      { headers: { "Accept-Language": "pt-pt,*" } }
    );
  });

  it("Should successfully get data", async () => {
    // Arrange.
    mockedAxios.get.mockResolvedValueOnce({
      data: { objects: [{ data: "test" }] },
    });

    // Act.
    const res = await collectionFetcher([slug, {} as Dimensions]);

    // Assert
    expect(res).toEqual(successResponse);
  });

  it("Should return error if no object", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({ data: { objects: [] } });

    // Assert
    await expect(collectionFetcher([slug, {} as Dimensions])).rejects.toThrow(
      "Collection not found"
    );
  });

  it("Should return error if object is empty", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({ data: {} });

    // Assert
    await expect(collectionFetcher([slug, {} as Dimensions])).rejects.toThrow(
      "Collection not found"
    );
  });

  it("should throw an error if asset Url is incorrect", async () => {
    // Arrange
    const handlePromise = () =>
      new Promise((resolve, reject) => {
        reject(new Error("collectionFetcher axios error"));
      });
    const handle = handlePromise();
    mockedAxios.get.mockResolvedValueOnce(handle);

    // Assert
    await expect(collectionFetcher([slug, {} as Dimensions])).rejects.toThrow(
      "collectionFetcher axios error"
    );
  });
});
