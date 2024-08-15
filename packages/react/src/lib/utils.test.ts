// eslint-disable-next-line import/no-extraneous-dependencies
import "regenerator-runtime/runtime";
import {
  DimensionKey,
  Dimensions,
  graphQLClient,
  ImageUrls,
} from "@skylark-reference-apps/lib";
import {
  getImageSrcAndSizeByWindow,
  skylarkRequestWithDimensions,
} from "./utils";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("@skylark-reference-apps/lib", () => ({
  ...jest.requireActual("@skylark-reference-apps/lib"),
  SAAS_API_ENDPOINT: "https://endpoint/graphql",
  SAAS_API_KEY: "api-key",
}));

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

  describe("skylarkRequestWithDimensions", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("makes a request without additional headers when time travel is empty", async () => {
      jest.spyOn(graphQLClient, "request");
      (graphQLClient.request as jest.Mock).mockImplementation(() => {});

      const dimensions: Dimensions = {
        [DimensionKey.TimeTravel]: "",
        [DimensionKey.Property]: "",
        [DimensionKey.Language]: "",
        [DimensionKey.Region]: "",
      };

      await skylarkRequestWithDimensions("query", dimensions);

      expect(graphQLClient.request).toHaveBeenCalledWith(
        "query",
        {},
        {
          "x-language": "",
          "x-sl-dimension-properties": "",
          "x-sl-dimension-regions": "",
        },
      );
    });

    it("makes a request and adds the time travel header when its populated", async () => {
      jest.spyOn(graphQLClient, "request");
      (graphQLClient.request as jest.Mock).mockImplementation(() => {});

      const dimensions: Dimensions = {
        [DimensionKey.TimeTravel]: "next week",
        [DimensionKey.Property]: "",
        [DimensionKey.Language]: "",
        [DimensionKey.Region]: "",
      };

      await skylarkRequestWithDimensions("query", dimensions);

      expect(graphQLClient.request).toHaveBeenCalledWith(
        "query",
        {},
        {
          "x-time-travel": "next week",
          "x-language": "",
          "x-sl-dimension-properties": "",
          "x-sl-dimension-regions": "",
        },
      );
    });
  });
});
