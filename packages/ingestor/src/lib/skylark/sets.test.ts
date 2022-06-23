import Auth from "@aws-amplify/auth";
import { Attachment } from "airtable";
import axios, { AxiosRequestConfig } from "axios";
import { convertAirtableFieldsToSkylarkObject } from ".";
import { Metadata, SetConfig } from "../../interfaces";
import { createOrUpdateSetAndContents } from "./sets";

jest.mock("axios");
jest.mock("@aws-amplify/auth");
jest.mock("@skylark-reference-apps/lib", () => ({
  SKYLARK_API: "https://skylarkplatform.io",
}));

describe("skylark.get", () => {
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

  describe("createOrUpdateSetAndContents", () => {
    const homePageSlider: SetConfig = {
      title: "Home page hero",
      slug: "media-reference-home-page-hero",
      set_type_slug: "slider",
      contents: [
        { type: "brands", slug: "game-of-thrones" },
        { type: "movies", slug: "deadpool-2" },
        { type: "movies", slug: "sing-2" },
        { type: "movies", slug: "us" },
      ],
    };

    const metadata: Metadata = {
      airtableCredits: [],
      genres: [],
      themes: [],
      imageTypes: [],
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
        additionalFields: [],
      },
      schedules: {
        always: {
          uid: "1",
          slug: "always-schedule",
          title: "Always",
          status: "active",
          self: "/api/schedules/1",
        },
      },
    };

    it("creates the set when the set doesn't exist in Skylark", async () => {
      axiosRequest.mockImplementation(() => ({ data: {} }));
      await createOrUpdateSetAndContents(
        { ...homePageSlider, contents: [] },
        metadata
      );

      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/sets/",
          method: "POST",
          data: {
            uid: "",
            self: "",
            set_type_url: "/api/set-types/set-type-1",
            slug: "media-reference-home-page-hero",
            title: "Home page hero",
          },
        })
      );
    });

    it("updates the set when it does exist in Skylark", async () => {
      axiosRequest.mockImplementation(({ method }: AxiosRequestConfig) => {
        if (method === "GET") {
          return {
            data: {
              objects: [
                {
                  uid: "1",
                  title: "Home page hero",
                  slug: "media-reference-home-page-hero",
                  set_type_slug: "slider",
                  self: "/api/sets/1",
                },
              ],
            },
          };
        }

        return { data: {} };
      });
      await createOrUpdateSetAndContents(
        { ...homePageSlider, contents: [] },
        metadata
      );

      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/sets/1",
          method: "PUT",
          data: {
            uid: "1",
            self: "/api/sets/1",
            set_type_slug: "slider",
            set_type_url: "/api/set-types/set-type-1",
            slug: "media-reference-home-page-hero",
            title: "Home page hero",
          },
        })
      );
    });

    it("does not create any set items when none are given in the contents", async () => {
      axiosRequest.mockImplementation(({ method }: AxiosRequestConfig) => {
        if (method === "GET") {
          return {
            data: {
              objects: [
                {
                  uid: "1",
                  title: "Home page hero",
                  slug: "media-reference-home-page-hero",
                  set_type_slug: "slider",
                  self: "/api/sets/1",
                },
              ],
            },
          };
        }

        return { data: {} };
      });
      await createOrUpdateSetAndContents(
        { ...homePageSlider, contents: [] },
        metadata
      );

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
      const metadataWithGenres: Metadata = {
        ...metadata,
        genres: [
          {
            uid: "genre_1",
            self: "/api/genres/genre_1",
            name: "Action",
            slug: "action",
            airtableId: "genre-1-airtable",
          },
        ],
        set: {
          ...metadata.set,
          additionalFields: [
            {
              slug: "media-reference-home-page-hero",
              genres: ["genre-1-airtable"],
            },
          ],
        },
      };
      axiosRequest.mockImplementation(() => ({ data: {} }));
      await createOrUpdateSetAndContents(
        { ...homePageSlider, contents: [] },
        metadataWithGenres
      );

      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/sets/",
          method: "POST",
          data: {
            ...convertAirtableFieldsToSkylarkObject(
              metadataWithGenres.set.additionalFields[0],
              metadataWithGenres
            ),
            genre_urls: ["/api/genres/genre_1"],
            uid: "",
            self: "",
            set_type_url: "/api/set-types/set-type-1",
            slug: "media-reference-home-page-hero",
            title: "Home page hero",
          },
        })
      );
    });

    it("should create images using the Airtable attachment and connect them to the set", async () => {
      const image: Attachment = {
        id: "airtable-image-1",
        url: "https://download-this-image.jpg",
        filename: "download-this-image",
        size: 12,
        type: "idk",
      };
      const metadataWithImages: Metadata = {
        ...metadata,
        imageTypes: [
          {
            name: "main",
            slug: "main",
            uid: "image-type-1",
            self: "/api/image-types/image-type-1",
          },
        ],
        set: {
          ...metadata.set,
          additionalFields: [
            {
              slug: "media-reference-home-page-hero",
              image__main: [image],
            },
          ],
        },
      };
      axiosRequest.mockImplementation(({ method }: AxiosRequestConfig) => {
        if (method === "POST") {
          return {
            data: {
              uid: "1",
              title: "Home page hero",
              slug: "media-reference-home-page-hero",
              set_type_slug: "slider",
              self: "/api/sets/1",
            },
          };
        }

        return { data: {} };
      });
      await createOrUpdateSetAndContents(
        { ...homePageSlider, contents: [] },
        metadataWithImages
      );

      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/images/?title=download-this-image",
          method: "GET",
        })
      );

      expect(axiosRequest).toHaveBeenNthCalledWith(
        4,
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/images/",
          method: "POST",
          data: {
            content_url: "/api/sets/1",
            image_location: "https://download-this-image.jpg",
            image_type_url: "/api/image-types/image-type-1",
            title: "download-this-image",
            schedule_urls: ["/api/schedules/1"],
          },
        })
      );
    });

    it("should throw an error when attempting to create images from Airtable when the image type doesn't exist in Skylark", async () => {
      const image: Attachment = {
        id: "airtable-image-1",
        url: "https://download-this-image.jpg",
        filename: "download-this-image",
        size: 12,
        type: "idk",
      };
      const metadataWithImages: Metadata = {
        ...metadata,
        set: {
          ...metadata.set,
          additionalFields: [
            {
              slug: "media-reference-home-page-hero",
              image__main: [image],
            },
          ],
        },
      };
      axiosRequest.mockImplementation(() => ({ data: {} }));
      await expect(
        createOrUpdateSetAndContents(
          { ...homePageSlider, contents: [] },
          metadataWithImages
        )
      ).rejects.toThrow(
        `Invalid image type "main" (image__main field on Airtable)`
      );
    });
  });
});
