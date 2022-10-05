import { Credit, Credits, ImageUrls } from "../interfaces";
import { formatCredits, getCreditsByType, getImageSrc } from "./classic";

describe("utils", () => {
  describe("getImageSrc", () => {
    const imageUrls: ImageUrls = {
      isExpanded: true,
      items: [
        {
          self: "/api/image/1",
          url: "https://skylark.com/images/1.jpg",
          urlPath: "/images/1.jpg",
          type: "Thumbnail",
        },
        {
          self: "/api/image/2",
          url: "https://skylark.com/images/2.jpg",
          urlPath: "/images/2.jpg",
          type: "Main",
        },
      ],
    };

    it("returns the matching image source for the given type", () => {
      const src = getImageSrc(imageUrls, "Main");
      expect(src).toEqual("https://skylark.com/images/2.jpg");
    });

    it("returns empty string if the images is undefined", () => {
      const src = getImageSrc(undefined, "Main");
      expect(src).toEqual("");
    });

    it("returns empty string if the images have not been expanded by the API", () => {
      const src = getImageSrc(
        { isExpanded: false, items: [{ self: "/api/image/1" }] },
        "Main"
      );
      expect(src).toEqual("");
    });

    it("returns empty string if the given image array is empty", () => {
      const src = getImageSrc({ isExpanded: true, items: [] }, "Main");
      expect(src).toEqual("");
    });

    it("returns first image if the type isn't found", () => {
      const src = getImageSrc(imageUrls, "Poster");
      expect(src).toEqual("https://skylark.com/images/1.jpg");
    });

    it("returns an the image source with given sizing", () => {
      const src = getImageSrc(imageUrls, "Main", "100x100");
      expect(src).toEqual("https://skylark.com/images/2-100x100.jpg");
    });
  });

  describe("getCreditsByType", () => {
    const credits: Credits = {
      isExpanded: true,
      items: [
        {
          character: "",
          roleUrl: {
            title: "Director",
          },
          peopleUrl: {
            name: "Donald",
          },
        },
        {
          character: "",
          roleUrl: {
            title: "Director",
          },
          peopleUrl: {
            name: "Glover",
          },
        },
        {
          character: "",
          roleUrl: {
            title: "Writer",
          },
          peopleUrl: {
            name: "Childish Gambino",
          },
        },
      ],
    };

    it("returns all Directors", () => {
      const directors = getCreditsByType(credits, "Director");
      expect(directors).toEqual([
        {
          character: "",
          roleUrl: {
            title: "Director",
          },
          peopleUrl: {
            name: "Donald",
          },
        },
        {
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

  describe("formatCredits", () => {
    it("returns credit people names", () => {
      const credits: Credit[] = Array.from({ length: 2 }, (_, index) => ({
        peopleUrl: {
          name: `person-${index + 1}`,
        },
        roleUrl: {
          title: "Director",
        },
        character: "",
      }));

      const formattedCredits = formatCredits(credits);

      expect(formattedCredits).toEqual(["person-1", "person-2"]);
    });

    it("filters credits that do not have a name", () => {
      const credits: Credit[] = Array.from({ length: 2 }, (_, index) => ({
        peopleUrl: {
          name: `person-${index + 1}`,
        },
        roleUrl: {
          title: "Director",
        },
        character: "",
      }));
      credits.push({
        peopleUrl: {
          name: "",
        },
        roleUrl: {
          title: "Director",
        },
        character: "",
      });

      const formattedCredits = formatCredits(credits);

      expect(formattedCredits).toEqual(["person-1", "person-2"]);
    });

    it("adds character name when 4 or less credits are given with character names", () => {
      const credits: Credit[] = Array.from({ length: 2 }, (_, index) => ({
        peopleUrl: {
          name: `person-${index + 1}`,
        },
        roleUrl: {
          title: "Director",
        },
        character: `character-${index + 1}`,
      }));

      const formattedCredits = formatCredits(credits);

      expect(formattedCredits).toEqual([
        "person-1 as character-1",
        "person-2 as character-2",
      ]);
    });

    it("does not add character names when 5 credits are given with character names", () => {
      const credits: Credit[] = Array.from({ length: 5 }, (_, index) => ({
        peopleUrl: {
          name: `person-${index + 1}`,
        },
        roleUrl: {
          title: "Director",
        },
        character: `character-${index + 1}`,
      }));

      const formattedCredits = formatCredits(credits);

      expect(formattedCredits).toEqual([
        "person-1",
        "person-2",
        "person-3",
        "person-4",
        "person-5",
      ]);
    });
  });
});
