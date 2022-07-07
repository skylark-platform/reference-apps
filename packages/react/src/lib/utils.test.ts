import { ImageUrls } from "@skylark-reference-apps/lib";
import { getImageSrcAndSizeByWindow } from "./utils";

describe("utils", () => {
  describe("getImageSrcAndSizeByWindow", () => {
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

    const { window } = global;
    afterEach(() => {
      global.window = window;
    });

    it("returns image without size if window is undefined", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete global.window;
      const src = getImageSrcAndSizeByWindow(imageUrls, "Main");
      expect(src).toEqual("https://skylark.com/images/2.jpg");
    });

    it("returns image with size set to window innerWidth as it is larger than innerHeight", () => {
      window.innerWidth = 200;
      window.innerHeight = 100;
      window.dispatchEvent(new Event("resize"));
      const src = getImageSrcAndSizeByWindow(imageUrls, "Main");
      expect(src).toEqual("https://skylark.com/images/2-200x200.jpg");
    });

    it("returns image with size set to window innerHeight as it is larger than innerWidth", () => {
      window.innerWidth = 100;
      window.innerHeight = 200;
      window.dispatchEvent(new Event("resize"));
      const src = getImageSrcAndSizeByWindow(imageUrls, "Main");
      expect(src).toEqual("https://skylark.com/images/2-200x200.jpg");
    });
  });
});
