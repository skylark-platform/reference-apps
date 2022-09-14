/**
 * @jest-environment node
 */
import { Dimensions } from "@skylark-reference-apps/lib";
import axios from "axios";
import { brandWithSeasonFetcher } from "../../hooks/useBrandWithSeasonBySlug";

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
  tags: undefined,
  themes: undefined,
  title: { long: "", medium: "", short: "" },
  titleSort: "",
  type: null,
  uid: "",
};

describe("brandWithSeasonFetcher hook tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds the Skylark Dimension Settings to the request", async () => {
    // Act
    mockedAxios.get.mockResolvedValueOnce({ data: { objects: "mockData" } });
    await brandWithSeasonFetcher([
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
    // Act
    mockedAxios.get.mockResolvedValueOnce({
      data: { objects: [{ data: "test" }] },
    });
    const res = await brandWithSeasonFetcher([slug, {} as Dimensions]);

    // Assert
    expect(res).toEqual(successResponse);
  });

  it("Should return error if no object", async () => {
    // Act
    mockedAxios.get.mockResolvedValueOnce({ data: { objects: [] } });

    // Assert
    await expect(
      brandWithSeasonFetcher([slug, {} as Dimensions])
    ).rejects.toThrow("Brand not found");
  });

  it("Should return error if object is empty", async () => {
    // Act
    mockedAxios.get.mockResolvedValueOnce({ data: {} });

    // Assert
    await expect(
      brandWithSeasonFetcher([slug, {} as Dimensions])
    ).rejects.toThrow("Brand not found");
  });

  it("should throw an error if asset Url is incorrect", async () => {
    // Arrange
    const handlePromise = () =>
      new Promise((resolve, reject) => {
        reject(new Error("brandWithSeasonFetcher axios error"));
      });

    // Assert
    const handle = handlePromise();
    mockedAxios.get.mockResolvedValueOnce(handle);
    await expect(
      brandWithSeasonFetcher([slug, {} as Dimensions])
    ).rejects.toThrow("brandWithSeasonFetcher axios error");
  });
});
