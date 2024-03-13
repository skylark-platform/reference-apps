import { DimensionKey, Dimensions } from "@skylark-reference-apps/lib";
import * as utils from "../../lib/utils";
import { Entertainment } from "../../types";
import { Credit, SkylarkImageListing, ImageType } from "../../types/gql";

const credits: Credit[] = [
  {
    uid: "credit-1",
    character: "Childish Gambino",
    roles: { objects: [{ uid: "role-1", title: "Actor" }] },
    people: { objects: [{ uid: "person-1", name: "Donald Glover" }] },
  },
  {
    uid: "credit-2",
    roles: { objects: [{ uid: "role-1", title: "Actor" }] },
    people: { objects: [{ uid: "person-2", name: "Brad Pitt" }] },
  },
  {
    uid: "credit-3",
    roles: { objects: [{ uid: "role-2", title: "Writer" }] },
    people: { objects: [{ uid: "person-3", name: "Famous writer" }] },
  },
  {
    uid: "credit-4",
    roles: { objects: [{ uid: "role-1", title: "Actor" }] },
    people: { objects: [{ uid: "person-4", name: "Angelina Jolie" }] },
  },
  {
    uid: "credit-5",
    roles: { objects: [{ uid: "role-1", title: "Actor" }] },
    people: { objects: [{ uid: "person-5", name: "George Clooney" }] },
  },
];

const images: SkylarkImageListing = {
  objects: [
    { uid: "image-1", url: "poster.jpg", type: "POSTER" },
    { uid: "image-1", url: "thumbnail.jpg", type: "THUMBNAIL" },
  ],
};

describe("utils.ts", () => {
  describe("formatGraphQLCredits", () => {
    it("returns credits with the character name when credits has a length of 2", () => {
      const got = utils.formatGraphQLCredits([credits[0], credits[1]]);
      expect(got).toEqual(["Donald Glover - Childish Gambino", "Brad Pitt"]);
    });

    it("returns credits without the character name when credits has a length of 5", () => {
      const got = utils.formatGraphQLCredits(credits);
      expect(got).toEqual([
        "Donald Glover",
        "Brad Pitt",
        "Famous writer",
        "Angelina Jolie",
        "George Clooney",
      ]);
    });
  });

  describe("convertObjectToName", () => {
    it("returns an empty array when no objects are given", () => {
      const got = utils.convertObjectToName({ objects: [] });
      expect(got).toEqual([]);
    });

    it("returns an array of names", () => {
      const got = utils.convertObjectToName({
        objects: [
          { uid: "theme-1", name: "Theme 1" },
          { uid: "theme-2", name: "Theme 2" },
        ],
      });
      expect(got).toEqual(["Theme 1", "Theme 2"]);
    });
  });

  describe("getFirstRatingValue", () => {
    it("returns an empty string when no objects are given", () => {
      const got = utils.getFirstRatingValue({ objects: [] });
      expect(got).toEqual("");
    });

    it("returns the first rating's value", () => {
      const got = utils.getFirstRatingValue({
        objects: [{ uid: "rating-1", value: "18" }],
      });
      expect(got).toEqual("18");
    });
  });

  describe("getGraphQLImageSrc", () => {
    it("returns an empty string when no images are given", () => {
      const got = utils.getGraphQLImageSrc(
        { objects: [] },
        ImageType.Thumbnail,
      );
      expect(got).toEqual("");
    });

    it("returns the image url for the Thumbnail", () => {
      const got = utils.getGraphQLImageSrc(images, ImageType.Thumbnail);
      expect(got).toEqual("thumbnail.jpg");
    });

    it("returns the first image when none are found for the given type", () => {
      const got = utils.getGraphQLImageSrc(images, ImageType.Main);
      expect(got).toEqual("poster.jpg");
    });
  });

  describe("getTitleByOrderForGraphQLObject", () => {
    it("returns the expected title", () => {
      const got = utils.getTitleByOrderForGraphQLObject(
        {
          title_long: "title",
          title_short: "Short title",
        } as Entertainment,
        ["title_long", "title_short"],
      );
      expect(got).toEqual("title");
    });
  });

  describe("getSynopsisByOrderForGraphQLObject", () => {
    it("returns the expected synopsis", () => {
      const got = utils.getSynopsisByOrderForGraphQLObject(
        {
          synopsis_long: "synopsis",
          synopsis_short: "Short synopsis",
        } as Entertainment,
        ["synopsis_long", "synopsis_short"],
      );
      expect(got).toEqual("synopsis");
    });
  });

  describe("createGraphQLQueryDimensions", () => {
    it("translates the active dimensions into the expected GraphQL format", () => {
      const dimensions: Dimensions = {
        [DimensionKey.Language]: "en-GB",
        [DimensionKey.DeviceType]: "smartphone",
        [DimensionKey.CustomerType]: "premium",
        [DimensionKey.Region]: "europe",
        [DimensionKey.TimeTravel]: "",
      };

      const got = utils.createGraphQLQueryDimensions(dimensions);

      expect(got).toEqual({
        dimensions: [
          { dimension: "device-types", value: "smartphone" },
          { dimension: "customer-types", value: "premium" },
          { dimension: "regions", value: "europe" },
        ],
        language: dimensions.language,
      });
    });
  });

  describe("convertTypenameToObjectType", () => {
    it("converts a given typename to the expected type", () => {
      const got = utils.convertTypenameToObjectType("Episode");
      expect(got).toEqual("episode");
    });
  });

  describe("convertGraphQLSetType", () => {
    it("converts a collection set type", () => {
      const got = utils.convertGraphQLSetType("COLLECTION");
      expect(got).toEqual("collection");
    });

    it("converts a rail set type", () => {
      const got = utils.convertGraphQLSetType("RAIL");
      expect(got).toEqual("rail");
    });

    it("converts a slider set type", () => {
      const got = utils.convertGraphQLSetType("SLIDER");
      expect(got).toEqual("slider");
    });

    it("defaults to a set type of page", () => {
      const got = utils.convertGraphQLSetType("PAGE");
      expect(got).toEqual("page");
    });
  });
});
