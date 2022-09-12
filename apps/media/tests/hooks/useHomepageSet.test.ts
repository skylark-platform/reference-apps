/**
 * @jest-environment node
 */
import { Dimensions } from "@skylark-reference-apps/lib";
import axios from "axios";
import { homepageSetFetcher } from "../../hooks/useHomepageSet";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
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

describe("homepageSetFetcher hook tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds the Skylark Dimension Settings to the request", async () => {
    // Act
    mockedAxios.get.mockResolvedValueOnce({ data: { objects: "mockData" } });
    await homepageSetFetcher([
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

  it("Should get the correct homepage", async () => {
    // Act
    mockedAxios.get.mockResolvedValueOnce({ data: { objects: "mockData" } });
    const res = await homepageSetFetcher([
      "key",
      { language: "en-gb" } as Dimensions,
    ]);

    // Assert
    expect(res).toEqual(successResponse);
  });

  it("should throw an error if homepage is incorrect", async () => {
    // Arrange
    const handlePromise = () =>
      new Promise((resolve, reject) => {
        reject(new Error("homepageSetFetcher axios error"));
      });

    // Assert
    const handle = handlePromise();
    mockedAxios.get.mockResolvedValueOnce(handle);
    await expect(
      homepageSetFetcher(["key", { language: "en-gb" } as Dimensions])
    ).rejects.toThrow("homepageSetFetcher axios error");
  });
});
