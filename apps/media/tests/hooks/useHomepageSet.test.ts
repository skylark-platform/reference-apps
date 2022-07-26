/**
 * @jest-environment node
 */
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

  it("Should get the correct homepage", async () => {
    // Act
    mockedAxios.get.mockResolvedValueOnce({ data: { objects: "mockData" } });
    const res = await homepageSetFetcher();

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
    await expect(homepageSetFetcher()).rejects.toThrow(
      "homepageSetFetcher axios error"
    );
  });
});
