import Auth from "@aws-amplify/auth";
import { Attachment, FieldSet, Record } from "airtable";
import axios, { AxiosRequestConfig } from "axios";
import { convertAirtableFieldsToSkylarkObject } from ".";
import { Metadata, SetConfig } from "../../interfaces";
import { createOrUpdateSetAndContents } from "./sets";

jest.mock("axios");
jest.mock("@aws-amplify/auth");
jest.mock("@skylark-reference-apps/lib", () => ({
  SKYLARK_API: "https://skylarkplatform.io",
}));

describe("skylark.sets", () => {
  let axiosRequest: jest.Mock;

  beforeEach(() => {
    axiosRequest = axios.request as jest.Mock;
    Auth.currentSession = jest.fn().mockResolvedValue({
      getIdToken: jest.fn().mockReturnValue({
        getJwtToken: jest.fn().mockReturnValue("token"),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const alwaysSchedule = {
    uid: "1",
    slug: "always-schedule",
    title: "Always",
    starts: "1/1/2000",
    ends: "1/1/2000",
    rights: false,
    status: "active",
    self: "/api/schedules/1",
    affiliate_urls: [],
    customer_type_urls: [],
    device_type_urls: [],
    language_urls: [],
    locale_urls: [],
    operating_system_urls: [],
    region_urls: [],
    viewing_context_urls: [],
  };

  describe("createOrUpdateSetAndContents", () => {
    const homePageSlider: SetConfig = {
      dataSourceId: "home-page-slider",
      externalId: "home_page_slider",
      title: "Home page hero",
      slug: "media-reference-home-page-hero",
      set_type_slug: "slider",
      graphQlSetType: "SLIDER",
      contents: [
        { type: "brands", slug: "game-of-thrones" },
        { type: "movies", slug: "deadpool-2" },
        { type: "movies", slug: "sing-2" },
        { type: "movies", slug: "us" },
      ],
    };

    const imageTypes = [
      {
        name: "main",
        slug: "main",
        uid: "image-type-1",
        self: "/api/image-types/image-type-1",
        airtableId: "image_type_1",
      },
    ];

    const imageAttachment: Attachment = {
      id: "airtable-image-1",
      url: "https://download-this-image.jpg",
      filename: "download-this-image",
      size: 12,
      type: "idk",
    };

    const airtableImageWithValidType: object = {
      id: "image-1",
      fields: {
        title: imageAttachment.filename,
        image: [imageAttachment],
        "type-reference": [imageTypes[0].airtableId],
        schedule_urls: [],
      },
    };

    const airtableImageWithInvalidType: object = {
      id: "image-2",
      fields: {
        title: imageAttachment.filename,
        image: [imageAttachment],
        "type-reference": ["invalid"],
        schedule_urls: [],
      },
    };

    const metadata: Metadata = {
      airtableCredits: [],
      airtableImages: [
        airtableImageWithValidType as Record<FieldSet>,
        airtableImageWithInvalidType as Record<FieldSet>,
      ],
      genres: [],
      themes: [],
      tags: [],
      imageTypes,
      assetTypes: [],
      tagTypes: [],
      ratings: [],
      roles: [],
      people: [],
      set: {
        types: [
          {
            title: "slider",
            uid: "set-type-1",
            slug: "slider",
            self: "/api/set-types/set-type-1",
          },
        ],
        additionalRecords: [],
      },
      schedules: {
        default: alwaysSchedule,
        always: alwaysSchedule,
        all: [],
      },
      dimensions: {
        affiliates: [],
        customerTypes: [],
        deviceTypes: [],
        languages: [],
        locales: [],
        operatingSystems: [],
        regions: [],
        viewingContext: [],
      },
    };

    const set = {
      uid: "set_1",
      title: homePageSlider.title,
      slug: homePageSlider.slug,
      set_type_slug: homePageSlider.set_type_slug,
      set_type_url: `/api/set-types/set-type-1`,
      self: "/api/sets/set_1",
      schedule_urls: ["/api/schedules/1"],
      data_source_id: "set_1",
    };

    const genres = [
      {
        uid: "genre_1",
        self: "/api/genres/genre_1",
        name: "Action",
        slug: "action",
        airtableId: "genre-1-airtable",
      },
    ];

    it("creates the set when the set doesn't exist in Skylark", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({ data: {} }));

      // Act.
      await createOrUpdateSetAndContents(
        { ...homePageSlider, contents: [] },
        metadata
      );

      // Assert.
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { set_type_url, slug, title, schedule_urls } = set;
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/sets/versions/data-source/home-page-slider/",
          method: "PUT",
          data: { set_type_url, slug, title, schedule_urls },
        })
      );
    });

    it("updates the set when it does exist in Skylark", async () => {
      // Arrange.
      axiosRequest.mockImplementation(({ method }: AxiosRequestConfig) => {
        if (method === "GET") {
          return {
            data: {
              objects: [set],
            },
          };
        }

        return { data: {} };
      });

      // Act.
      await createOrUpdateSetAndContents(
        { ...homePageSlider, contents: [] },
        metadata
      );

      // Assert.
      expect(axiosRequest).toBeCalledTimes(2);
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/sets/versions/data-source/home-page-slider/",
          method: "PUT",
          data: set,
        })
      );
    });

    it("does not create any set items when none are given in the contents", async () => {
      // Arrange.
      axiosRequest.mockImplementation(({ method }: AxiosRequestConfig) => {
        if (method === "GET") {
          return {
            data: {
              objects: [set],
            },
          };
        }

        return { data: {} };
      });

      // Act.
      await createOrUpdateSetAndContents(
        { ...homePageSlider, contents: [] },
        metadata
      );

      // Assert.
      expect(axiosRequest).toBeCalledTimes(2);
      expect(axiosRequest).not.toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/sets/1/items",
          method: "GET",
        })
      );
      expect(axiosRequest).not.toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/sets/1/items/",
          method: "POST",
        })
      );
    });

    it("should convert genres from Airtable into genre_urls (converts additional properties)", async () => {
      // Arrange.
      const metadataWithGenres: Metadata = {
        ...metadata,
        genres,
        set: {
          ...metadata.set,
          additionalRecords: [
            {
              id: "1",
              fields: {
                slug: set.slug,
                genres: [genres[0].airtableId],
              },
            },
          ],
        },
      };
      axiosRequest.mockImplementation(() => ({ data: {} }));

      // Act.
      await createOrUpdateSetAndContents(
        { ...homePageSlider, contents: [] },
        metadataWithGenres
      );

      // Assert.
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { set_type_url, slug, title } = set;
      expect(axiosRequest).toBeCalledTimes(2);
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/sets/versions/data-source/home-page-slider/",
          method: "PUT",
          data: {
            ...convertAirtableFieldsToSkylarkObject(
              homePageSlider.dataSourceId,
              metadataWithGenres.set.additionalRecords[0].fields,
              metadataWithGenres
            ),
            genre_urls: [genres[0].self],
            uid: "",
            self: "",
            set_type_url,
            slug,
            title,
          },
        })
      );
    });

    it("should create images using the Airtable attachment and connect them to the set", async () => {
      // Arrange.
      const metadataWithImages: Metadata = {
        ...metadata,
        imageTypes,
        set: {
          ...metadata.set,
          additionalRecords: [
            {
              id: "1",
              fields: {
                slug: homePageSlider.slug,
                images: ["image-1"],
              },
            },
          ],
        },
      };
      axiosRequest.mockImplementation(({ method }: AxiosRequestConfig) => {
        if (method === "PUT") {
          return {
            data: set,
          };
        }

        return { data: {} };
      });

      // Act.
      await createOrUpdateSetAndContents(
        { ...homePageSlider, contents: [] },
        metadataWithImages
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/images/versions/data-source/image-1-set_1/",
          method: "GET",
        })
      );
      expect(axiosRequest).toHaveBeenNthCalledWith(
        4,
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/images/versions/data-source/image-1-set_1/",
          method: "PUT",
          data: {
            content_url: set.self,
            image_location: "https://download-this-image.jpg",
            image_type_url: "/api/image-types/image-type-1",
            title: "download-this-image",
            schedule_urls: ["/api/schedules/1"],
            data_source_id: "image-1-set_1",
          },
        })
      );
    });

    it("should throw an error when attempting to create images from Airtable when the image type doesn't exist in Skylark", async () => {
      // Arrange.
      const metadataWithImages: Metadata = {
        ...metadata,
        set: {
          ...metadata.set,
          additionalRecords: [
            {
              id: "1",
              fields: {
                slug: homePageSlider.slug,
                images: ["image-2"],
              },
            },
          ],
        },
      };
      axiosRequest.mockImplementation(() => ({ data: {} }));

      // Act.
      await expect(
        createOrUpdateSetAndContents(
          { ...homePageSlider, contents: [] },
          metadataWithImages
        )
      ).rejects.toThrow(`Invalid image type "invalid"`);
    });

    it("should request existing set items when the setConfig has contents", async () => {
      // Arrange.
      axiosRequest.mockImplementation(({ method, url }: AxiosRequestConfig) => {
        if (method === "PUT") {
          return {
            data: set,
          };
        }

        if (method === "GET") {
          if (url?.includes("/api/brands")) {
            return {
              data: {
                objects: [{ uid: "brand_1" }],
              },
            };
          }
          return {
            data: set,
          };
        }

        return { data: { objects: [] } };
      });

      // Act.
      await createOrUpdateSetAndContents(
        { ...homePageSlider, contents: [homePageSlider.contents[0]] },
        metadata
      );

      // Assert.
      expect(axiosRequest).toBeCalledTimes(5);
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/cms-sets/set_1/items/",
          method: "GET",
        })
      );
    });

    it("should make a POST request to add the item to the set", async () => {
      // Arrange.
      axiosRequest.mockImplementation(({ method, url }: AxiosRequestConfig) => {
        if (method === "PUT") {
          return {
            data: set,
          };
        }

        if (method === "GET") {
          if (url?.includes("/api/brands")) {
            return {
              data: {
                objects: [{ uid: "brand_1" }],
              },
            };
          }
          return {
            data: set,
          };
        }

        return { data: { objects: [] } };
      });

      // Act.
      await createOrUpdateSetAndContents(
        { ...homePageSlider, contents: [homePageSlider.contents[0]] },
        metadata
      );

      // Assert.
      expect(axiosRequest).toBeCalledTimes(5);
      expect(axiosRequest).toHaveBeenNthCalledWith(
        5,
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/sets/set_1/items/",
          method: "POST",
        })
      );
    });

    it("should make a PUT request to update the item in the set when it already exists in it", async () => {
      // Arrange.
      axiosRequest.mockImplementation(({ method, url }: AxiosRequestConfig) => {
        if (method === "PUT") {
          return {
            data: set,
          };
        }

        if (method === "GET") {
          if (url?.includes("/api/brands")) {
            return {
              data: {
                objects: [{ uid: "brand_1", self: "/api/brands/brand_1" }],
              },
            };
          }

          if (url?.includes("/api/cms-sets/set_1/items/")) {
            return {
              data: {
                objects: [
                  { uid: "set_item_1", content_url: "/api/brands/brand_1" },
                ],
              },
            };
          }
          return {
            data: set,
          };
        }

        return { data: { objects: [] } };
      });

      // Act.
      await createOrUpdateSetAndContents(
        { ...homePageSlider, contents: [homePageSlider.contents[0]] },
        metadata
      );

      // Assert.
      expect(axiosRequest).toBeCalledTimes(5);
      expect(axiosRequest).toHaveBeenNthCalledWith(
        5,
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/sets/set_1/items/set_item_1/",
          method: "PUT",
        })
      );
    });

    it("throws an error when the resource does not exist in Skylark", async () => {
      // Arrange.
      axiosRequest.mockImplementation(({ method, url }: AxiosRequestConfig) => {
        if (method === "POST") {
          return {
            data: set,
          };
        }

        if (method === "GET") {
          if (url?.includes("/api/brands")) {
            return {
              data: {
                objects: [],
              },
            };
          }

          return {
            data: set,
          };
        }

        return { data: { objects: [] } };
      });

      // Act.
      await expect(
        createOrUpdateSetAndContents(
          { ...homePageSlider, contents: [homePageSlider.contents[0]] },
          metadata
        )
      ).rejects.toThrow(
        "Object requested for set item game-of-thrones (brands) not found"
      );
    });
  });
});
