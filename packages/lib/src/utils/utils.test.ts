import {
  formatReleaseDate,
  getTitleByOrder,
  sortArrayIntoAlphabeticalOrder,
  sortObjectByNumberProperty,
} from "./utils";

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
        "objectTitle",
      );
      expect(title).toEqual("objectTitle");
    });

    it("returns the objectTitle when the titles are undefined", () => {
      const title = getTitleByOrder(
        undefined,
        ["short", "medium", "long"],
        "objectTitle",
      );
      expect(title).toEqual("objectTitle");
    });
  });

  describe("formatReleaseDate", () => {
    const date = "2000-01-01";

    it("returns date in the default format when a format isn't given", () => {
      const formattedDate = formatReleaseDate(date);
      expect(formattedDate).toEqual("January 1, 2000");
    });

    it("returns date in the default format when the date has a timezone and a format isn't given", () => {
      const formattedDate = formatReleaseDate("2000-01-01+00:50");
      expect(formattedDate).toEqual("January 1, 2000");
    });

    it("returns date in the given format when a format is given", () => {
      const formattedDate = formatReleaseDate(date, "en-gb", "YYYY");
      expect(formattedDate).toEqual("2000");
    });

    it("returns empty string when date is undefined", () => {
      const formattedDate = formatReleaseDate(undefined);
      expect(formattedDate).toEqual("");
    });

    it("translates release date to the given locale", () => {
      const formattedDate = formatReleaseDate(date, "pt-pt");
      expect(formattedDate).toEqual("janeiro 1, 2000");
    });
  });

  describe("sortObjectByNumberProperty", () => {
    const arr = [
      { number: 10 },
      { number: 1 },
      { number: 5 },
      { number: 4 },
      { number: 5 },
    ];

    it("sorts the objects by the number property", () => {
      const got = arr.sort(sortObjectByNumberProperty);
      expect(got).toEqual([
        { number: 1 },
        { number: 4 },
        { number: 5 },
        { number: 5 },
        { number: 10 },
      ]);
    });
  });

  describe("sortArrayIntoAlphabeticalOrder", () => {
    const arr = ["bananas", "apples", "peach", "Car", "AVOCADO"];

    it("sorts the array of strings into alphabetical order", () => {
      const got = arr.sort(sortArrayIntoAlphabeticalOrder);
      expect(got).toEqual(["apples", "AVOCADO", "bananas", "Car", "peach"]);
    });
  });
});
