import Auth from "@aws-amplify/auth";
import { ApiEntertainmentObject, ApiImage } from "@skylark-reference-apps/lib";
import axios, { AxiosError } from "axios";
import {
  getResourceBySlug,
  getResourceByName,
  getResourceByProperty,
  getResourceByTitle,
  getSetBySlug,
  getSetItems,
  getResources,
  getResourceByDataSourceId,
} from "./get";

jest.mock("axios");
jest.mock("@aws-amplify/auth");
jest.mock("@skylark-reference-apps/lib", () => ({
  SKYLARK_API: "https://skylarkplatform.io",
}));

describe("skylark.get", () => {
  let axiosRequest: jest.Mock;

  beforeEach(() => {
    axiosRequest = axios.request as jest.Mock;
    Auth.currentSession = jest.fn().mockResolvedValue({
      getIdToken: jest.fn().mockReturnValue({
        getJwtToken: jest.fn().mockReturnValue("token"),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getResources", () => {
    it("calls /api/image-types", async () => {
      axiosRequest.mockResolvedValue({ data: {} });
      await getResources("image-types");

      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/image-types/",
        })
      );
    });

    it("returns image types", async () => {
      const imageTypes: Partial<ApiImage>[] = [
        { title: "image1", uid: "1", url: "http://image.com/1" },
        { title: "image2", uid: "2", url: "http://image.com/2" },
      ];
      axiosRequest.mockResolvedValue({ data: { objects: imageTypes } });
      const got = await getResources("image-types");

      expect(got).toEqual(imageTypes);
    });

    it("returns an empty array when no objects are returned", async () => {
      axiosRequest.mockResolvedValue({ data: {} });
      const got = await getResources("image-types");

      expect(got).toEqual([]);
    });
  });

  describe("getResourceByDataSourceId", () => {
    it("calls axios.request with expected config", async () => {
      axiosRequest.mockResolvedValue({ data: [] });
      await getResourceByDataSourceId("episodes", "data_source_id");

      expect(axiosRequest).toBeCalledWith({
        url: "https://skylarkplatform.io/api/episodes/versions/data-source/data_source_id/",
        method: "GET",
        params: {
          all: true,
        },
        headers: expect.any(Object) as object,
      });
    });

    it("returns null when an empty object is returned", async () => {
      axiosRequest.mockResolvedValue({
        data: {},
      });
      const resource = await getResourceByDataSourceId(
        "episodes",
        "data_source_id"
      );

      expect(resource).toBeNull();
    });

    it("returns the object returned in res.data", async () => {
      axiosRequest.mockResolvedValue({
        data: { uid: 1 },
      });
      const resource = await getResourceByDataSourceId(
        "episodes",
        "data_source_id"
      );

      expect(resource).toEqual({ uid: 1 });
    });

    it("returns null when the request returns a 404 code", async () => {
      const mockedIsAxiosError = axios.isAxiosError as unknown as jest.Mock;
      mockedIsAxiosError.mockReturnValue(true);
      const err = {
        response: { status: 404 },
      } as AxiosError;
      axiosRequest.mockRejectedValue(err);
      const resource = await getResourceByDataSourceId(
        "episodes",
        "data_source_id"
      );

      expect(resource).toBeNull();
    });
  });

  describe("getResourceByProperty", () => {
    it("calls axios.request with expected config", async () => {
      axiosRequest.mockResolvedValue({ data: [] });
      await getResourceByProperty("episodes", "slug", "searchQuery");

      expect(axiosRequest).toBeCalledWith({
        url: "https://skylarkplatform.io/api/episodes/?slug=searchQuery",
        method: "GET",
        params: {
          all: true,
        },
        headers: expect.any(Object) as object,
      });
    });

    it("returns the first object when the requested item is found", async () => {
      axiosRequest.mockResolvedValue({
        data: { objects: ["first", "second"] },
      });
      const resource = await getResourceByProperty(
        "episodes",
        "slug",
        "searchQuery"
      );

      expect(resource).toEqual("first");
    });

    it("returns null when no objects are returned", async () => {
      axiosRequest.mockResolvedValue({ data: { objects: [] } });
      const resource = await getResourceByProperty(
        "episodes",
        "slug",
        "searchQuery"
      );

      expect(resource).toBeNull();
    });

    it("returns null when data is empty", async () => {
      axiosRequest.mockResolvedValue({ data: {} });
      const resource = await getResourceByProperty(
        "episodes",
        "slug",
        "searchQuery"
      );

      expect(resource).toBeNull();
    });
  });

  describe("getResourceBySlug", () => {
    it("calls axios.request with a slug query", async () => {
      axiosRequest.mockResolvedValue({ data: [] });
      await getResourceBySlug("episodes", "searchQuery");

      expect(axiosRequest).toBeCalledWith({
        url: "https://skylarkplatform.io/api/episodes/?slug=searchQuery",
        method: "GET",
        params: {
          all: true,
        },
        headers: expect.any(Object) as object,
      });
    });
  });

  describe("getResourceByTitle", () => {
    it("calls axios.request with a title query", async () => {
      axiosRequest.mockResolvedValue({ data: [] });
      await getResourceByTitle("episodes", "searchQuery");

      expect(axiosRequest).toBeCalledWith({
        url: "https://skylarkplatform.io/api/episodes/?title=searchQuery",
        method: "GET",
        params: {
          all: true,
        },
        headers: expect.any(Object) as object,
      });
    });
  });

  describe("getResourceByName", () => {
    it("calls axios.request with a name query", async () => {
      axiosRequest.mockResolvedValue({ data: [] });
      await getResourceByName("episodes", "searchQuery");

      expect(axiosRequest).toBeCalledWith({
        url: "https://skylarkplatform.io/api/episodes/?name=searchQuery",
        method: "GET",
        params: {
          all: true,
        },
        headers: expect.any(Object) as object,
      });
    });
  });

  describe("getSetBySlug", () => {
    it("calls /api/sets/?set_type_slug=", async () => {
      axiosRequest.mockResolvedValue({ data: {} });
      await getSetBySlug("collection", "my-collection");

      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/sets/?set_type_slug=collection&slug=my-collection",
        })
      );
    });

    it("returns the first set object returned", async () => {
      const setTypes: ApiEntertainmentObject[] = [
        { uid: "1", title: "set1", self: "/api/sets/set1", slug: "set1" },
        { uid: "2", title: "set2", self: "/api/sets/set2", slug: "set2" },
      ];
      axiosRequest.mockResolvedValue({ data: { objects: setTypes } });
      const got = await getSetBySlug("collection", "my-collection");

      expect(got).toEqual(setTypes[0]);
    });

    it("returns null when no objects are returned", async () => {
      axiosRequest.mockResolvedValue({ data: {} });
      const got = await getSetBySlug("collection", "my-collection");

      expect(got).toEqual(null);
    });
  });

  describe("getSetItems", () => {
    it("calls /api/sets/?set_type_slug=", async () => {
      axiosRequest.mockResolvedValue({ data: {} });
      await getSetItems("set-1");

      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/sets/set-1/items/",
        })
      );
    });

    it("returns all objects", async () => {
      const setTypes: ApiEntertainmentObject[] = [
        {
          uid: "1",
          title: "episode",
          self: "/api/episode/1",
          slug: "episode1",
        },
        { uid: "2", title: "movie", self: "/api/movie/1", slug: "movie1" },
      ];
      axiosRequest.mockResolvedValue({ data: { objects: setTypes } });
      const got = await getSetItems("set-1");

      expect(got).toEqual(setTypes);
    });

    it("returns an empty array when no objects are returned", async () => {
      axiosRequest.mockResolvedValue({ data: {} });
      const got = await getSetItems("set-1");

      expect(got).toEqual([]);
    });
  });
});
