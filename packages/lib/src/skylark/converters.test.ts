import { EntertainmentType } from "../interfaces";
import {
  convertEntertainmentTypeToString,
  convertObjectToSkylarkApiFields,
  convertObjectTypeToSkylarkEndpoint,
  convertToUnexpandedObjects,
  convertUrlToObjectType,
} from "./converters";

const fieldsToExpand = {
  items: {
    content_url: {
      items: {
        content_url: {
          image_urls: {},
        },
        image_urls: {},
      },
    },
  },
};

const fields = {
  items: {
    content_url: {
      set_type_slug: {},
      self: {},
      items: {
        content_url: {
          image_urls: {},
          title_short: {},
          self: {},
        },
      },
    },
  },
};

describe("converters", () => {
  describe("convertObjectToSkylarkApiFields", () => {
    it("returns the fieldsToExpand in the expected structure", () => {
      const str = convertObjectToSkylarkApiFields(fieldsToExpand);

      expect(str).toEqual(
        [
          "items",
          "items__content_url",
          "items__content_url__items",
          "items__content_url__items__content_url",
          "items__content_url__items__content_url__image_urls",
          "items__content_url__items__image_urls",
        ].join(",")
      );
    });

    it("returns the fields in the expected structure", () => {
      const str = convertObjectToSkylarkApiFields(fields);

      expect(str).toEqual(
        [
          "items",
          "items__content_url",
          "items__content_url__set_type_slug",
          "items__content_url__self",
          "items__content_url__items",
          "items__content_url__items__content_url",
          "items__content_url__items__content_url__image_urls",
          "items__content_url__items__content_url__title_short",
          "items__content_url__items__content_url__self",
        ].join(",")
      );
    });
  });

  describe("convertEntertainmentTypeToString", () => {
    it("converts episode to Episode", () => {
      const str = convertEntertainmentTypeToString("episode");
      expect(str).toEqual("Episode");
    });

    it("returns an empty string when the type doesn't exist", () => {
      expect(() =>
        convertEntertainmentTypeToString("unknown" as EntertainmentType)
      ).toThrow("Unknown EntertainmentType");
    });
  });

  describe("convertObjectTypeToSkylarkEndpoint", () => {
    it("converts episode to episodes", () => {
      const str = convertObjectTypeToSkylarkEndpoint("episode");
      expect(str).toEqual("episodes");
    });

    it("converts movie to movies", () => {
      const str = convertObjectTypeToSkylarkEndpoint("movie");
      expect(str).toEqual("movies");
    });

    it("converts season to seasons", () => {
      const str = convertObjectTypeToSkylarkEndpoint("season");
      expect(str).toEqual("seasons");
    });

    it("converts brand to brands", () => {
      const str = convertObjectTypeToSkylarkEndpoint("brand");
      expect(str).toEqual("brands");
    });

    it("returns an empty string when the type doesn't exist", () => {
      expect(() =>
        convertObjectTypeToSkylarkEndpoint("unknown" as EntertainmentType)
      ).toThrow("Unknown type provided");
    });
  });

  describe("convertUrlToObjectType", () => {
    it("converts /api/episodes to episode", () => {
      const type = convertUrlToObjectType("/api/episodes");
      expect(type).toEqual("episode");
    });

    it("converts /api/movies to movie", () => {
      const type = convertUrlToObjectType("/api/movies");
      expect(type).toEqual("movie");
    });

    it("converts /api/seasons to season", () => {
      const type = convertUrlToObjectType("/api/seasons");
      expect(type).toEqual("season");
    });

    it("converts /api/brands to brand", () => {
      const type = convertUrlToObjectType("/api/brands");
      expect(type).toEqual("brand");
    });

    it("converts /api/assets to asset", () => {
      const type = convertUrlToObjectType("/api/assets");
      expect(type).toEqual("asset");
    });

    it("converts an unknown URL to null", () => {
      const type = convertUrlToObjectType("/api/unknown");
      expect(type).toEqual(null);
    });
  });

  describe("convertToUnexpandedObjects", () => {
    it("converts an array of urls to UnexpandedObjects", () => {
      const objects = convertToUnexpandedObjects([
        "/api/episode/1",
        "/api/episode/2",
      ]);

      expect(objects).toEqual([
        {
          self: "/api/episode/1",
          isExpanded: false,
        },
        {
          self: "/api/episode/2",
          isExpanded: false,
        },
      ]);
    });
  });
});
