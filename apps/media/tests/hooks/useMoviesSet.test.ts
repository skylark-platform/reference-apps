/**
 * @jest-environment node
 */
import axios from "axios";
import { moviesSetFetcher } from "../../hooks/useMoviesSet";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const successResponse = [
  {
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
  },
  {
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
  },
];

describe("moviesSetFetcher hook tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should get the correct movies set", async () => {
    // Act
    mockedAxios.get.mockResolvedValueOnce({
      data: { objects: ["movie one", "movie two"] },
    });
    const res = await moviesSetFetcher(["movie", ""]);

    // Assert
    expect(res).toEqual(successResponse);
  });

  it("should throw an error if movies set is incorrect", async () => {
    // Arrange
    const handlePromise = () =>
      new Promise((resolve, reject) => {
        reject(new Error("moviesSetFetcher axios error"));
      });

    // Assert
    const handle = handlePromise();
    mockedAxios.get.mockResolvedValueOnce(handle);
    await expect(moviesSetFetcher(["movie", ""])).rejects.toThrow(
      "moviesSetFetcher axios error"
    );
  });
});
