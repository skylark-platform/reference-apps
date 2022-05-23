import { parseSkylarkObject } from ".";
import {
  ApiEntertainmentObject,
  Credit,
  ImageUrl,
  SkylarkObject,
  UnexpandedObject,
} from "../interfaces";
import {
  createSkylarkApiQuery,
  parseSkylarkImageUrls,
  parseSkylarkCredits,
} from "./skylarkApiHelpers";

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

describe("skylarkApiHelpers", () => {
  describe("createSkylarkApiQuery", () => {
    it("returns the expected query", () => {
      const parsedFieldsToExpand = [
        "items",
        "items__content_url",
        "items__content_url__items",
        "items__content_url__items__content_url",
        "items__content_url__items__content_url__image_urls",
        "items__content_url__items__image_urls",
      ].join(",");

      const parsedFields = [
        "items",
        "items__content_url",
        "items__content_url__set_type_slug",
        "items__content_url__self",
        "items__content_url__items",
        "items__content_url__items__content_url",
        "items__content_url__items__content_url__image_urls",
        "items__content_url__items__content_url__title_short",
        "items__content_url__items__content_url__self",
      ].join(",");

      const query = createSkylarkApiQuery({
        fieldsToExpand,
        fields,
      });

      expect(query).toEqual(
        `fields_to_expand=${parsedFieldsToExpand}&fields=${parsedFields}`
      );
    });
  });

  describe("parseSkylarkImageUrls", () => {
    it("parses Image URLs when they are not expanded", () => {
      const imageUrls = parseSkylarkImageUrls(["/api/image/1", "/api/image/2"]);

      const expected: UnexpandedObject[] = [
        {
          isExpanded: false,
          self: "/api/image/1",
        },
        {
          isExpanded: false,
          self: "/api/image/2",
        },
      ];

      expect(imageUrls).toEqual(expected);
    });

    it("parses Image URLs when they are expanded", () => {
      const imageUrls = parseSkylarkImageUrls([
        {
          self: "/api/images/1",
          url: "skylark.com/image/1.jpg",
          url_path: "/image/1.jpg",
          image_type: "Thumbnail",
        },
        {
          self: "/api/images/2",
          url: "skylark.com/image/2.jpg",
          url_path: "/image/2.jpg",
          image_type: "Main",
        },
      ]);

      const expected: ImageUrl[] = [
        {
          isExpanded: true,
          self: "/api/images/1",
          url: "skylark.com/image/1.jpg",
          urlPath: "/image/1.jpg",
          type: "Thumbnail",
        },
        {
          isExpanded: true,
          self: "/api/images/2",
          url: "skylark.com/image/2.jpg",
          urlPath: "/image/2.jpg",
          type: "Main",
        },
      ];

      expect(imageUrls[0]).toHaveProperty("isExpanded", true);
      expect(imageUrls).toEqual(expected);
    });
  });

  describe("parseSkylarkCredits", () => {
    it("parses Credits when they are not expanded", () => {
      const imageUrls = parseSkylarkCredits(["/api/credit/1", "/api/credit/2"]);

      const expected: UnexpandedObject[] = [
        {
          isExpanded: false,
          self: "/api/credit/1",
        },
        {
          isExpanded: false,
          self: "/api/credit/2",
        },
      ];

      expect(imageUrls).toEqual(expected);
    });

    it("parses Credits when they are expanded", () => {
      const imageUrls = parseSkylarkCredits([
        {
          character: "Alexander Hamilton",
          people_url: {
            name: "Lin",
          },
          role_url: {
            title: "Actor",
          },
        },
        {
          character: "Aaron Burr",
          people_url: {
            name: "Leslie",
          },
          role_url: {
            title: "Actor",
          },
        },
      ]);

      const expected: Credit[] = [
        {
          isExpanded: true,
          character: "Alexander Hamilton",
          peopleUrl: {
            name: "Lin",
          },
          roleUrl: {
            title: "Actor",
          },
        },
        {
          isExpanded: true,
          character: "Aaron Burr",
          peopleUrl: {
            name: "Leslie",
          },
          roleUrl: {
            title: "Actor",
          },
        },
      ];

      expect(imageUrls[0]).toHaveProperty("isExpanded", true);
      expect(imageUrls).toEqual(expected);
    });
  });

  describe("parseSkylarkObject", () => {
    const apiObject: ApiEntertainmentObject = {
      uid: "1",
      title: "object title",
      title_short: "Short title",
      title_medium: "Medium title",
      title_long: "Long title",
      synopsis_short: "Short synopsis",
      synopsis_medium: "Medium synopsis",
      synopsis_long: "Long synopsis",
      self: "/api/unknown-object",
      slug: "object-title",
    };

    const defaultExpectedObject: SkylarkObject = {
      uid: "1",
      isExpanded: true,
      objectTitle: "object title",
      self: "/api/unknown-object",
      slug: "object-title",
      title: {
        short: "Short title",
        medium: "Medium title",
        long: "Long title",
      },
      synopsis: {
        short: "Short synopsis",
        medium: "Medium synopsis",
        long: "Long synopsis",
      },
      type: null,
      tags: [],
      themeUrls: [],
      titleSort: "",
      releaseDate: "",
      ratingUrls: [],
      items: [],
      images: [],
      credits: [],
      genreUrls: [],
    };

    it("parses a SkylarkObject with no items", () => {
      const parsedObject = parseSkylarkObject(apiObject);

      expect(parsedObject).toEqual(defaultExpectedObject);
    });

    it("parses a SkylarkObject with items", () => {
      const apiObjectWithItems: ApiEntertainmentObject = {
        ...apiObject,
        items: [apiObject, apiObject],
      };

      const parsedObject = parseSkylarkObject(apiObjectWithItems);

      const expectedObject: SkylarkObject = {
        ...defaultExpectedObject,
        items: [defaultExpectedObject, defaultExpectedObject],
      };

      expect(parsedObject).toEqual(expectedObject);
    });

    it("parses a SkylarkObject with items that also has items", () => {
      const apiObjectWithItems: ApiEntertainmentObject = {
        ...apiObject,
        items: [
          {
            ...apiObject,
            items: [apiObject, apiObject],
          },
          apiObject,
        ],
      };

      const parsedObject = parseSkylarkObject(apiObjectWithItems);

      const expectedObject: SkylarkObject = {
        ...defaultExpectedObject,
        items: [
          {
            ...defaultExpectedObject,
            items: [defaultExpectedObject, defaultExpectedObject],
          },
          defaultExpectedObject,
        ],
      };

      expect(parsedObject).toEqual(expectedObject);
    });

    it("parses additional Episode fields when the self URL starts with /api/episode", () => {
      const obj: ApiEntertainmentObject = {
        ...apiObject,
        self: "/api/episodes/1",
        episode_number: 5,
      };

      const parsedObject = parseSkylarkObject(obj);

      expect(parsedObject).toHaveProperty("number", 5);
      expect(parsedObject).toHaveProperty("type", "episode");
    });

    it("parses additional Movie fields when the self URL starts with /api/movie", () => {
      const obj: ApiEntertainmentObject = {
        ...apiObject,
        self: "/api/movies/1",
      };

      const parsedObject = parseSkylarkObject(obj);

      expect(parsedObject).toHaveProperty("type", "movie");
    });

    it("parses additional Season fields when the self URL starts with /api/season", () => {
      const obj: ApiEntertainmentObject = {
        ...apiObject,
        self: "/api/seasons/1",
        season_number: 1,
        number_of_episodes: 10,
        year: 2015,
      };

      const parsedObject = parseSkylarkObject(obj);

      expect(parsedObject).toHaveProperty("type", "season");
      expect(parsedObject).toHaveProperty("numberOfEpisodes", 10);
      expect(parsedObject).toHaveProperty("number", 1);
      expect(parsedObject).toHaveProperty("releaseDate", "2015");
    });

    it("parses additional Brand fields when the self URL starts with /api/brand", () => {
      const obj: ApiEntertainmentObject = {
        ...apiObject,
        self: "/api/brands/1",
      };

      const parsedObject = parseSkylarkObject(obj);

      expect(parsedObject).toHaveProperty("type", "brand");
    });

    it("parses additional Set fields when the self URL starts with /api/set and a set_type_slug is given", () => {
      const obj: ApiEntertainmentObject = {
        ...apiObject,
        self: "/api/set/1",
        set_type_slug: "collection",
      };

      const parsedObject = parseSkylarkObject(obj);

      expect(parsedObject).toHaveProperty("type", "collection");
    });
  });
});
