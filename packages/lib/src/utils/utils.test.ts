import { ImageUrls } from "../interfaces";
import { getImageSrc } from "./utils";

describe("utils", () => {
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

    it("returns first image if the type isn't found", () => {
      const src = getImageSrc(imageUrls, "Poster");

      expect(src).toEqual("https://skylark.com/images/1.jpg");
    });

    it("returns an the image source with given sizing", () => {
      const src = getImageSrc(imageUrls, "Main", "100x100");

      expect(src).toEqual("https://skylark.com/images/2-100x100.jpg");
    });
  });
});
