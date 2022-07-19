/**
 * @jest-environment node
 */
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

  it("Should successfully get data", async () => {
    // Arrange.
    mockedAxios.get.mockResolvedValueOnce({
      data: { objects: [{ data: "test" }] },
    });

    // Act.
    const res = await collectionFetcher([slug, ""]);

    // Assert
    expect(res).toEqual(successResponse);
  });

  it("Should return error if no object", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({ data: { objects: [] } });

    // Assert
    await expect(collectionFetcher([slug, ""])).rejects.toThrow(
      "Collection not found"
    );
  });

  it("Should return error if object is empty", async () => {
    // Arrange
    mockedAxios.get.mockResolvedValueOnce({ data: {} });

    // Assert
    await expect(collectionFetcher([slug, ""])).rejects.toThrow(
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
    await expect(collectionFetcher([slug, ""])).rejects.toThrow(
      "collectionFetcher axios error"
    );
  });
});
