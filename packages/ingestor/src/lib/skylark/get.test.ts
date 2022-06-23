import Auth from "@aws-amplify/auth";
import {
  ApiEntertainmentObject,
  ApiImage,
  ApiSchedule,
  ApiSetType,
} from "@skylark-reference-apps/lib";
import axios from "axios";
import {
  getResourceBySlug,
  getSetTypes,
  getAlwaysSchedule,
  getImageTypes,
  getResourceByName,
  getResourceByProperty,
  getResourceByTitle,
  getSetBySlug,
  getSetItems,
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

  describe("getAlwaysSchedule", () => {
    it("returns the always schedule when it is found", async () => {
      const schedule: ApiSchedule = {
        uid: "1",
        self: "/api/schedule/1",
        slug: "always",
        title: "always-scheduled",
        status: "enabled",
      };
      axiosRequest.mockResolvedValue({ data: { objects: [schedule] } });
      const got = await getAlwaysSchedule();

      expect(got).toEqual(schedule);
    });

    it("throws an error when the schedule is not found", async () => {
      axiosRequest.mockResolvedValue({ data: { objects: [] } });

      await expect(getAlwaysSchedule()).rejects.toThrow(
        "Always schedule not found"
      );
    });
  });

  describe("getImageTypes", () => {
    it("calls /api/image-types", async () => {
      axiosRequest.mockResolvedValue({ data: {} });
      await getImageTypes();

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
      const got = await getImageTypes();

      expect(got).toEqual(imageTypes);
    });

    it("returns an empty array when no objects are returned", async () => {
      axiosRequest.mockResolvedValue({ data: {} });
      const got = await getImageTypes();

      expect(got).toEqual([]);
    });
  });

  describe("getSetTypes", () => {
    it("calls /api/set-types", async () => {
      axiosRequest.mockResolvedValue({ data: {} });
      await getSetTypes();

      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/set-types/",
        })
      );
    });

    it("returns set types", async () => {
      const setTypes: Partial<ApiSetType>[] = [
        { title: "image1", uid: "1" },
        { title: "image2", uid: "2" },
      ];
      axiosRequest.mockResolvedValue({ data: { objects: setTypes } });
      const got = await getSetTypes();

      expect(got).toEqual(setTypes);
    });

    it("returns an empty array when no objects are returned", async () => {
      axiosRequest.mockResolvedValue({ data: {} });
      const got = await getSetTypes();

      expect(got).toEqual([]);
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
