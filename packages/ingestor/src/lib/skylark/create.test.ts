import Auth from "@aws-amplify/auth";
import { ApiImage } from "@skylark-reference-apps/lib";
import { Attachment, FieldSet, Record } from "airtable";
import axios from "axios";
import { DynamicObjectConfig, Metadata } from "../../interfaces";
import {
  createOrUpdateDynamicObject,
  createOrUpdateObject,
  parseAirtableImagesAndUploadToSkylark,
} from "./create";

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
      type: "main",
      schedule_urls: [],
    },
  };

  const airtableImageWithInvalidType: object = {
    id: "image-2",
    fields: {
      title: imageAttachment.filename,
      image: [imageAttachment],
      type: "invalid",
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
    imageTypes: [
      {
        name: "Main",
        slug: "main",
        uid: "image_type_1",
        self: "/api/image-types/image_type_1",
      },
    ],
    assetTypes: [],
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
      default: {
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
      },
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

  describe("createOrUpdateObject", () => {
    it("makes a GET request to the given resource with the query matching the property and value", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({ data: {} }));

      // Act.
      await createOrUpdateObject(
        "episode",
        { property: "slug", value: "episode-slug" },
        {},
        "PATCH"
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/episode/?slug=episode-slug",
          method: "GET",
        })
      );
    });

    it("makes a POST request with the given data when the object doesn't exist in Skylark", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({ data: {} }));
      const requestData = {
        uid: "1",
        slug: "slug",
      };

      // Act.
      await createOrUpdateObject(
        "episode",
        { property: "slug", value: "episode-slug" },
        requestData,
        "PATCH"
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/episode/",
          method: "POST",
          data: requestData,
        })
      );
    });

    it("makes a PATCH request when the object exists in Skylark and PATCH is the given update method", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({
        data: { objects: [{ uid: "1" }] },
      }));
      const requestData = {
        uid: "1",
        slug: "slug",
      };

      // Act.
      await createOrUpdateObject(
        "episode",
        { property: "slug", value: "episode-slug" },
        requestData,
        "PATCH"
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/episode/1",
          method: "PATCH",
          data: requestData,
        })
      );
    });

    it("makes a PUT request when the object exists in Skylark and PUT is the given update method", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({
        data: { objects: [{ uid: "1" }] },
      }));
      const requestData = {
        uid: "1",
        slug: "slug",
      };

      // Act.
      await createOrUpdateObject(
        "episode",
        { property: "slug", value: "episode-slug" },
        requestData,
        "PUT"
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/episode/1",
          method: "PUT",
          data: requestData,
        })
      );
    });

    it("overrides existing object data returned from the GET request", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({
        data: { objects: [{ uid: "1", slug: "old-slug" }] },
      }));
      const requestData = {
        uid: "1",
        slug: "new-slug",
      };

      // Act.
      await createOrUpdateObject(
        "episode",
        { property: "slug", value: "episode-slug" },
        requestData,
        "PUT"
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/episode/1",
          method: "PUT",
          data: requestData,
        })
      );
    });

    it("throws an error when the axios request fails", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => {
        throw new Error("axios rejection");
      });

      // Act.
      await expect(
        createOrUpdateObject(
          "episode",
          { property: "slug", value: "episode-slug" },
          {},
          "PUT"
        )
      ).rejects.toEqual(new Error("axios rejection"));
    });
  });

  describe("createOrUpdateDynamicObject", () => {
    it("looks up a dynamic object using its name", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({ data: {} }));
      const dynamicObject: DynamicObjectConfig = {
        name: "quentin-tarantino-movies",
        resource: "movies",
        query: "(people:%22Quentin Tarantino%22)",
      };

      // Act.
      await createOrUpdateDynamicObject(dynamicObject, metadata);

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: `https://skylarkplatform.io/api/computed-scheduled-items/?name=${dynamicObject.name}`,
          method: "GET",
        })
      );
    });

    it("creates a dynamic object using the given parameters", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({ data: {} }));
      const dynamicObject: DynamicObjectConfig = {
        name: "quentin-tarantino-movies",
        resource: "movies",
        query: "(people:%22Quentin Tarantino%22)",
      };

      // Act.
      await createOrUpdateDynamicObject(dynamicObject, metadata);

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/computed-scheduled-items/",
          method: "POST",
          data: {
            uid: "",
            self: "",
            name: dynamicObject.name,
            url: `/api/${dynamicObject.resource}/?order=-created&q=${dynamicObject.query}`,
            schedule_urls: [metadata.schedules.default.self],
          },
        })
      );
    });
  });

  describe("parseAirtableImagesAndUploadToSkylark", () => {
    const objectToAttachImageTo = {
      uid: "episode_1",
      self: "/api/episodes/episode_1",
      slug: "episode-1",
      title: "Episode 1",
    };

    it("throws an error when the given Airtable ID is does not match an image in Airtable", () => {
      expect(() =>
        parseAirtableImagesAndUploadToSkylark(
          ["no-matching-airtable-image"],
          objectToAttachImageTo,
          metadata
        )
      ).toThrow("Image not found for ID: no-matching-airtable-image");
    });

    it("throws an error when the found image does not have a valid image-type", () => {
      expect(() =>
        parseAirtableImagesAndUploadToSkylark(
          ["image-2"],
          objectToAttachImageTo,
          metadata
        )
      ).toThrow('Invalid image type "invalid"');
    });

    it("makes a GET request to check if the image already exists using its title property", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({ data: {} }));

      // Act.
      await parseAirtableImagesAndUploadToSkylark(
        ["image-1"],
        objectToAttachImageTo,
        metadata
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          method: "GET",
          url: `https://skylarkplatform.io/api/images/?title=${imageAttachment.filename}`,
        })
      );
    });

    it("makes a POST request to create the image", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({ data: {} }));

      // Act.
      await parseAirtableImagesAndUploadToSkylark(
        ["image-1"],
        objectToAttachImageTo,
        metadata
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          method: "POST",
          url: `https://skylarkplatform.io/api/images/`,
          data: {
            content_url: objectToAttachImageTo.self,
            image_location: imageAttachment.url,
            image_type_url: metadata.imageTypes[0].self,
            schedule_urls: [metadata.schedules.default.self],
            title: imageAttachment.filename,
          },
        })
      );
    });

    it("makes a PUT request to update the image", async () => {
      // Arrange.
      const image: Partial<ApiImage> = {
        uid: "image_1",
        content_url: objectToAttachImageTo.self,
        image_location: imageAttachment.url,
        image_type_url: metadata.imageTypes[0].self,
        schedule_urls: [metadata.schedules.default.self],
        title: imageAttachment.filename,
        url: "https://image-location-in-skylark",
      };
      axiosRequest.mockImplementation(() => ({ data: { objects: [image] } }));

      // Act.
      await parseAirtableImagesAndUploadToSkylark(
        ["image-1"],
        objectToAttachImageTo,
        metadata
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          method: "PUT",
          url: `https://skylarkplatform.io/api/images/${image.uid as string}`,
          data: image,
        })
      );
    });
  });

  describe("convertAirtableFieldsToSkylarkObject", () => {});
});
