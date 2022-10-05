/**
 * @jest-environment node
 */
import axios from "axios";
import {
  getSeoDataForObject,
  getSeoDataForSet,
} from "../../lib/getPageSeoData";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("@skylark-reference-apps/lib", () => ({
  ...jest.requireActual("@skylark-reference-apps/lib"),
  SKYLARK_API: "https://skylarkplatform.io",
}));
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getPageSeoData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSeoDataForObject", () => {
    it("calls the episode endpoint with given slug", async () => {
      // Arrange
      mockedAxios.get.mockResolvedValueOnce({ data: { objects: [] } });

      // Act
      await getSeoDataForObject("episode", "slug", "en-gb");

      // Assert
      expect(axios.get).toBeCalledWith(
        "https://skylarkplatform.io/api/episodes?fields_to_expand=image_urls&fields=title,image_urls,image_urls__url,title_short,title_medium,title_long,synopsis_short,synopsis_medium,synopsis_long&slug=slug",
        expect.any(Object)
      );
    });

    it("Should get the correct data", async () => {
      // Arrange
      const mockData = [
        {
          slug: "slug",
          title_short: "short title",
          synopsis_short: "short synopsis",
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: { objects: mockData } });

      // Act
      const res = await getSeoDataForObject("episode", "slug", "en-gb");

      // Assert
      expect(res).toEqual({
        title: "short title",
        synopsis: "short synopsis",
        images: undefined,
      });
    });

    it("should use the long title when all types are given", async () => {
      // Arrange
      const mockData = [
        {
          title_short: "short title",
          title_medium: "medium title",
          title_long: "long title",
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: { objects: mockData } });

      // Act
      const res = await getSeoDataForObject("episode", "slug", "en-gb");

      // Assert
      expect(res).toEqual({
        title: "long title",
        synopsis: "",
        images: undefined,
      });
    });

    it("should use the object title when no titles are given", async () => {
      // Arrange
      const mockData = [{ title: "object title" }];
      mockedAxios.get.mockResolvedValueOnce({ data: { objects: mockData } });

      // Act
      const res = await getSeoDataForObject("episode", "slug", "en-gb");

      // Assert
      expect(res).toEqual({
        title: "object title",
        synopsis: "",
        images: undefined,
      });
    });

    it("should use the short synopsis when all types are given", async () => {
      // Arrange
      const mockData = [
        {
          synopsis_short: "short synopsis",
          synopsis_medium: "medium synopsis",
          synopsis_long: "long synopsis",
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: { objects: mockData } });

      // Act
      const res = await getSeoDataForObject("episode", "slug", "en-gb");

      // Assert
      expect(res).toEqual({
        title: "",
        synopsis: "short synopsis",
        images: undefined,
      });
    });

    it("should return all images with a Skylark resize parameter", async () => {
      // Arrange
      const mockData = [
        { image_urls: [{ url: "image_1" }, { url: "image_2" }] },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: { objects: mockData } });

      // Act
      const res = await getSeoDataForObject("episode", "slug", "en-gb");

      // Assert
      expect(res).toEqual({
        title: "",
        synopsis: "",
        images: [{ url: "image_1-100x100" }, { url: "image_2-100x100" }],
      });
    });

    it("should throw an error if data is incorrect", async () => {
      // Arrange
      const handlePromise = () =>
        new Promise((resolve, reject) => {
          reject(new Error("axios error"));
        });

      // Assert
      const handle = handlePromise();
      mockedAxios.get.mockResolvedValueOnce(handle);
      await expect(
        getSeoDataForObject("episode", "slug", "en-gb")
      ).rejects.toThrow("axios error");
    });
  });

  describe("getSeoDataForSet", () => {
    it("calls the set endpoint with given slug and set slug", async () => {
      // Arrange
      mockedAxios.get.mockResolvedValueOnce({ data: { objects: [] } });

      // Act
      await getSeoDataForSet("collection", "slug", "en-gb");

      // Assert
      expect(axios.get).toBeCalledWith(
        "https://skylarkplatform.io/api/sets?fields_to_expand=image_urls&fields=title,image_urls,image_urls__url,title_short,title_medium,title_long,synopsis_short,synopsis_medium,synopsis_long&set_type_slug=collection&slug=slug",
        expect.any(Object)
      );
    });
  });
});
