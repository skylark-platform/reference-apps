import * as utils from "../../lib/utils";
import { Credit, ImageListing } from "../../types/gql";

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

const images: ImageListing = {
  objects: [
    { uid: "image-1", image_url: "poster.jpg", image_type: "Poster" },
    { uid: "image-1", image_url: "thumbnail.jpg", image_type: "Thumbnail" },
  ],
};

describe("utils.ts", () => {
  describe("getGraphQLCreditsByType", () => {
    it("returns all the Actors", () => {
      const got = utils.getGraphQLCreditsByType(credits, "Actor");
      expect(got).toEqual([credits[0], credits[1], credits[3], credits[4]]);
    });

    it("returns empty array when credits is empty", () => {
      const got = utils.getGraphQLCreditsByType([], "Actor");
      expect(got).toEqual([]);
    });
  });

  describe("formatGraphQLCredits", () => {
    it("returns credits with the character name when credits has a length of 2", () => {
      const got = utils.formatGraphQLCredits([credits[0], credits[1]]);
      expect(got).toEqual(["Donald Glover as Childish Gambino", "Brad Pitt"]);
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
      const got = utils.getGraphQLImageSrc({ objects: [] }, "Thumbnail");
      expect(got).toEqual("");
    });

    it("returns the image url for the Thumbnail", () => {
      const got = utils.getGraphQLImageSrc(images, "Thumbnail");
      expect(got).toEqual("thumbnail.jpg");
    });

    it("returns the first image when none are found for the given type", () => {
      const got = utils.getGraphQLImageSrc(images, "Main");
      expect(got).toEqual("poster.jpg");
    });
  });

  describe("getTitleByOrderForGraphQLObject", () => {
    it("returns the expected title", () => {
      const got = utils.getTitleByOrderForGraphQLObject(
        {
          title_short: "Short title",
          title_medium: "Medium title",
          title_long: "",
        },
        ["long", "medium", "short"]
      );
      expect(got).toEqual("Medium title");
    });
  });

  describe("getSynopsisByOrderForGraphQLObject", () => {
    it("returns the expected synopsis", () => {
      const got = utils.getSynopsisByOrderForGraphQLObject(
        {
          synopsis_short: "Short synopsis",
          synopsis_medium: "Medium synopsis",
          synopsis_long: "",
        },
        ["long", "medium", "short"]
      );
      expect(got).toEqual("Medium synopsis");
    });
  });
});
