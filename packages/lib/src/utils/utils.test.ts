import { getCreditsByType } from ".";
import { Credits, ImageUrls } from "../interfaces";
import { getImageSrc, getTitleByOrder } from "./utils";

describe("utils", () => {
  describe("getTitleByOrder", () => {
    it("returns the short title as its given as the type and all titles are valid", () => {
      const titles = {
        short: "short",
        medium: "medium",
        long: "long",
      };
      const title = getTitleByOrder(titles, ["short", "medium", "long"]);
      expect(title).toEqual("short");
    });

    it("returns the medium title as its given as the type and all titles are valid", () => {
      const titles = {
        short: "short",
        medium: "medium",
        long: "long",
      };
      const title = getTitleByOrder(titles, ["medium", "short", "long"]);
      expect(title).toEqual("medium");
    });

    it("returns the long title even though it is lowest priority as short and medium are both empty", () => {
      const titles = {
        short: "",
        medium: "",
        long: "long",
      };
      const title = getTitleByOrder(titles, ["short", "medium", "long"]);
      expect(title).toEqual("long");
    });

    it("returns an empty string when all TitleTypes are empty", () => {
      const titles = {
        short: "",
        medium: "",
        long: "",
      };
      const title = getTitleByOrder(titles, ["short", "medium", "long"]);
      expect(title).toEqual("");
    });

    it("returns an empty string when a valid title exists but it is not in the priority array", () => {
      const titles = {
        short: "",
        medium: "",
        long: "long",
      };
      const title = getTitleByOrder(titles, ["short", "medium"]);
      expect(title).toEqual("");
    });

    it("returns the objectTitle when no titles are valid and an objectTitle is given", () => {
      const titles = {
        short: "",
        medium: "",
        long: "",
      };
      const title = getTitleByOrder(
        titles,
        ["short", "medium", "long"],
        "objectTitle"
      );
      expect(title).toEqual("objectTitle");
    });

    it("returns the objectTitle when the titles are undefined", () => {
      const title = getTitleByOrder(
        undefined,
        ["short", "medium", "long"],
        "objectTitle"
      );
      expect(title).toEqual("objectTitle");
    });
  });

  describe("getImageSrc", () => {
    const imageUrls: ImageUrls = [
      {
        isExpanded: true,
        self: "/api/image/1",
        url: "https://skylark.com/images/1.jpg",
        urlPath: "/images/1.jpg",
        type: "Thumbnail",
      },
      {
        isExpanded: true,
        self: "/api/image/2",
        url: "https://skylark.com/images/2.jpg",
        urlPath: "/images/2.jpg",
        type: "Main",
      },
    ];

    it("returns the matching image source for the given type", () => {
      const src = getImageSrc(imageUrls, "Main");
      expect(src).toEqual("https://skylark.com/images/2.jpg");
    });

    it("returns an empty string when the type isn't found", () => {
      const src = getImageSrc(imageUrls, "Poster");
      expect(src).toEqual("");
    });

    it("returns an the image source with given sizing", () => {
      const src = getImageSrc(imageUrls, "Main", "100x100");
      expect(src).toEqual("https://skylark.com/images/2-100x100.jpg");
    });
  });

  describe("getCreditsByType", () => {
    const credits: Credits = [
      {
        isExpanded: true,
        character: "",
        roleUrl: {
          title: "Director",
        },
        peopleUrl: {
          name: "Donald",
        },
      },
      {
        isExpanded: true,
        character: "",
        roleUrl: {
          title: "Director",
        },
        peopleUrl: {
          name: "Glover",
        },
      },
      {
        isExpanded: true,
        character: "",
        roleUrl: {
          title: "Writer",
        },
        peopleUrl: {
          name: "Childish Gambino",
        },
      },
    ];

    it("returns all Directors", () => {
      const directors = getCreditsByType(credits, "Director");
      expect(directors).toEqual([
        {
          isExpanded: true,
          character: "",
          roleUrl: {
            title: "Director",
          },
          peopleUrl: {
            name: "Donald",
          },
        },
        {
          isExpanded: true,
          character: "",
          roleUrl: {
            title: "Director",
          },
          peopleUrl: {
            name: "Glover",
          },
        },
      ]);
    });

    it("returns no Actors as none are given", () => {
      const actors = getCreditsByType(credits, "Actor");
      expect(actors).toEqual([]);
    });

    it("returns an empty array as credits is undefined", () => {
      const got = getCreditsByType(undefined, "Actor");
      expect(got).toEqual([]);
    });
  });
});
