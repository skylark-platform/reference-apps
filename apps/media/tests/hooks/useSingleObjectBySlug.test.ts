/**
 * @jest-environment node
 */
import axios from "axios";
import { singleObjectFetcher } from "../../hooks/useSingleObjectBySlug";

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

describe("singleObjectFetcher hook tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should get the single object by slug", async () => {
    // Act
    mockedAxios.get.mockResolvedValueOnce({ data: { objects: ["movie-one"] } });
    const res = await singleObjectFetcher(["movie", "slug"]);

    // Assert
    expect(res).toEqual(successResponse);
  });

  it("should throw an error if slug is incorrect", async () => {
    // Arrange
    const handlePromise = () =>
      new Promise((resolve, reject) => {
        reject(new Error("singleObjectFetcher axios error"));
      });

    // Assert
    const handle = handlePromise();
    mockedAxios.get.mockResolvedValueOnce(handle);
    await expect(singleObjectFetcher(["movie", "slug"])).rejects.toThrow(
      "singleObjectFetcher axios error"
    );
  });
});
