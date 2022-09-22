import Auth from "@aws-amplify/auth";
import {
  ApiBaseObject,
  ApiBatchResponse,
  ApiCreditUnexpanded,
  ApiImage,
  ApiRole,
} from "@skylark-reference-apps/lib";
import { Attachment, FieldSet, Record, Records, Table } from "airtable";
import axios from "axios";
import {
  ApiAirtableFields,
  ApiEntertainmentObjectWithAirtableId,
  DynamicObjectConfig,
  Metadata,
} from "../../../interfaces";
import {
  convertAirtableFieldsToSkylarkObject,
  createOrUpdateAirtableObjectsInSkylark,
  createOrUpdateDynamicObject,
  createOrUpdateAirtableObjectsInSkylarkWithParentsInSameTable,
  createOrUpdateObject,
  parseAirtableImagesAndUploadToSkylark,
  createTranslationsForObjects,
  updateCredits,
  connectExternallyCreatedAssetToMediaObject,
} from "./create";

jest.mock("axios");
jest.mock("@aws-amplify/auth");
jest.mock("@skylark-reference-apps/lib", () => ({
  SKYLARK_API: "https://skylarkplatform.io",
}));

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

describe("skylark.create", () => {
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

  const imageTypes = [
    {
      name: "Main",
      slug: "main",
      uid: "image_type_1",
      self: "/api/image-types/image_type_1",
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
      type: [imageTypes[0].airtableId],
      schedule_urls: [],
    },
  };

  const airtableImageWithInvalidType: object = {
    id: "image-2",
    fields: {
      title: imageAttachment.filename,
      image: [imageAttachment],
      type: ["invalid"],
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
    imageTypes,
    assetTypes: [],
    tagTypes: [],
    ratings: [],
    tags: [],
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
      languages: [
        {
          uid: "portugal",
          self: "portugal",
          slug: "portugal",
          name: "Portugal",
          iso_code: "pt-pt",
          airtableId: "airtable-language-1",
        },
      ],
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
        {}
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
        requestData
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

    it("makes a PATCH request when the object exists in Skylark", async () => {
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
        requestData
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

    it("makes a PUT request when the object is an image and it exists", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({
        data: { objects: [{ uid: "1" }] },
      }));
      const requestData = {
        slug: "slug",
      };

      // Act.
      await createOrUpdateObject(
        "images",
        { property: "slug", value: "episode-slug" },
        requestData
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: "https://skylarkplatform.io/api/images/1",
          method: "PUT",
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
        requestData
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
          {}
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
            schedule_urls: [metadata.schedules.always.self],
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
          url: `https://skylarkplatform.io/api/images/versions/data-source/image-1-episode_1/`,
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
          method: "PUT",
          url: `https://skylarkplatform.io/api/images/versions/data-source/image-1-episode_1/`,
          data: {
            content_url: objectToAttachImageTo.self,
            image_location: imageAttachment.url,
            image_type_url: metadata.imageTypes[0].self,
            schedule_urls: [metadata.schedules.always.self],
            title: imageAttachment.filename,
            data_source_id: "image-1-episode_1",
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
        schedule_urls: [metadata.schedules.always.self],
        title: imageAttachment.filename,
        url: "https://image-location-in-skylark",
        data_source_id: "image-1-episode_1",
      };
      axiosRequest.mockImplementation(() => ({ data: image }));

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
          url: `https://skylarkplatform.io/api/images/versions/data-source/image-1-episode_1/`,
          data: image,
        })
      );
    });
  });

  describe("convertAirtableFieldsToSkylarkObject", () => {
    const parent: ApiEntertainmentObjectWithAirtableId = {
      airtableId: "parent-1",
      uid: "parent_1",
      title: "Parent",
      self: "/api/parent_1",
      slug: "parent-1",
    };

    it("returns the default object structure when no fields, metadata or parents are given", () => {
      const expected = {
        uid: "",
        self: "",
        schedule_urls: [metadata.schedules.always.self],
        data_source_id: "1",
        tags: [],
        data_source_fields: [
          "uid",
          "self",
          "name",
          "title",
          "slug",
          "title_short",
          "title_medium",
          "title_long",
          "synopsis_short",
          "synopsis_medium",
          "synopsis_long",
          "release_date",
          "parent_url",
          "schedule_urls",
          "season_number",
          "number_of_episodes",
          "episode_number",
          "value",
          "tags",
        ],
      };

      const skylarkObject = convertAirtableFieldsToSkylarkObject(
        "1",
        {},
        metadata
      );

      expect(skylarkObject).toEqual(expected);
    });

    it("removes undefined properties from the object when the Airtable field isn't supplied", () => {
      const skylarkObject = convertAirtableFieldsToSkylarkObject(
        "1",
        {},
        metadata
      );
      expect(skylarkObject).not.toHaveProperty("title");
      expect(skylarkObject).not.toHaveProperty("name");
    });

    it("adds the parent Skylark uid to the object when a parent is found", () => {
      const expected = {
        uid: "",
        self: "",
        schedule_urls: [metadata.schedules.always.self],
        data_source_id: "1",
        parent_url: parent.self,
        tags: [],
        data_source_fields: [
          "uid",
          "self",
          "name",
          "title",
          "slug",
          "title_short",
          "title_medium",
          "title_long",
          "synopsis_short",
          "synopsis_medium",
          "synopsis_long",
          "release_date",
          "parent_url",
          "schedule_urls",
          "season_number",
          "number_of_episodes",
          "episode_number",
          "value",
          "tags",
        ],
      };

      const skylarkObject = convertAirtableFieldsToSkylarkObject(
        "1",
        {
          parent: [parent.airtableId],
        },
        metadata,
        [parent]
      );

      expect(skylarkObject).toEqual(expected);
    });

    // Unskip when SL-2204 is fixed
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip("adds credits using the credits, people and roles tables", () => {
      const metadataWithCredits: Metadata = {
        ...metadata,
        people: [
          {
            airtableId: "airtable-person-1",
            name: "person-1",
            uid: "people_1",
            slug: "person-1",
            self: "/api/people/people_1",
          },
        ],
        roles: [
          {
            airtableId: "airtable-role-1",
            title: "role-1",
            uid: "role_1",
            self: "/api/roles/role_1",
          } as unknown as ApiRole & ApiAirtableFields,
        ],
        airtableCredits: [
          {
            id: "airtable-credit-1",
            fields: {
              person: ["airtable-person-1"],
              role: ["airtable-role-1"],
              character: "Johnny",
            } as object,
          } as Record<FieldSet>,
        ],
      };
      const expectedCredits: ApiCreditUnexpanded[] = [
        {
          people_url: metadataWithCredits.people[0].self,
          role_url: metadataWithCredits.roles[0].self,
          character: "Johnny",
        },
      ];

      const skylarkObject = convertAirtableFieldsToSkylarkObject(
        "1",
        {
          credits: ["airtable-credit-1"],
        },
        metadataWithCredits
      );

      expect(skylarkObject.credits).toEqual(expectedCredits);
    });

    it("adds genre_urls using the genres table", () => {
      const metadataWithGenres: Metadata = {
        ...metadata,
        genres: [
          {
            airtableId: "airtable-genre-1",
            name: "genre-1",
            uid: "genre_1",
            slug: "genre-1",
            self: "/api/genres/genre_1",
          },
          {
            airtableId: "airtable-genre-2",
            name: "genre-2",
            uid: "genre_2",
            slug: "genre-2",
            self: "/api/genres/genre_2",
          },
        ],
      };
      const expectedGenres: string[] = [metadataWithGenres.genres[0].self];

      const skylarkObject = convertAirtableFieldsToSkylarkObject(
        "1",
        {
          genres: ["airtable-genre-1"],
        },
        metadataWithGenres
      );

      expect(skylarkObject.genre_urls).toEqual(expectedGenres);
    });

    it("adds theme_urls using the themes table", () => {
      const metadataWithThemes: Metadata = {
        ...metadata,
        themes: [
          {
            airtableId: "airtable-theme-1",
            name: "theme-1",
            uid: "theme_1",
            slug: "theme-1",
            self: "/api/themes/theme_1",
          },
          {
            airtableId: "airtable-theme-2",
            name: "theme-2",
            uid: "theme_2",
            slug: "theme-2",
            self: "/api/themes/theme_2",
          },
        ],
      };
      const expected: string[] = [metadataWithThemes.themes[0].self];

      const skylarkObject = convertAirtableFieldsToSkylarkObject(
        "1",
        {
          themes: ["airtable-theme-1"],
        },
        metadataWithThemes
      );

      expect(skylarkObject.theme_urls).toEqual(expected);
    });

    it("adds rating_urls using the ratings table", () => {
      const metadataWithRatings: Metadata = {
        ...metadata,
        ratings: [
          {
            airtableId: "airtable-rating-1",
            title: "rating-1",
            uid: "rating_1",
            slug: "rating-1",
            self: "/api/ratings/rating_1",
          },
          {
            airtableId: "airtable-rating-2",
            title: "rating-2",
            uid: "rating_2",
            slug: "rating-2",
            self: "/api/ratings/rating_2",
          },
        ],
      };
      const expected: string[] = [metadataWithRatings.ratings[0].self];

      const skylarkObject = convertAirtableFieldsToSkylarkObject(
        "1",
        {
          ratings: ["airtable-rating-1"],
        },
        metadataWithRatings
      );

      expect(skylarkObject.rating_urls).toEqual(expected);
    });

    it("adds tags using the tags table", () => {
      const metadataWithTags: Metadata = {
        ...metadata,
        tags: [
          {
            airtableId: "airtable-tag-1",
            name: "tag-1",
            uid: "tag",
            slug: "tag-1",
            self: "/api/tags/tag-1",
            category_url: "/api/tag-categories/category-1",
          },
          {
            airtableId: "airtable-tag-2",
            name: "tag-2",
            uid: "tag",
            slug: "tag-2",
            self: "/api/tags/tag-2",
            category_url: "/api/tag-categories/category-1",
          },
        ],
      };
      const expected = [
        {
          schedule_urls: [alwaysSchedule.self],
          tag_url: metadataWithTags.tags[0].self,
        },
      ];

      const skylarkObject = convertAirtableFieldsToSkylarkObject(
        "1",
        {
          tags: ["airtable-tag-1"],
        },
        metadataWithTags
      );

      expect(skylarkObject.tags).toEqual(expected);
    });

    it("adds tag-categories using the tag-categories table", () => {
      const metadataWithTagCategories: Metadata = {
        ...metadata,
        tagTypes: [
          {
            airtableId: "airtable-tag-category-1",
            name: "tag-category-1",
            uid: "tag-category-1",
            slug: "tag-category-1",
            self: "/api/tag-categories/tag-category-1",
          },
        ],
      };
      const expected = metadataWithTagCategories.tagTypes[0].self;

      const skylarkObject = convertAirtableFieldsToSkylarkObject(
        "1",
        {
          category: ["airtable-tag-category-1"],
        },
        metadataWithTagCategories
      );

      expect(skylarkObject.category_url).toEqual(expected);
    });
  });

  describe("updateCredits", () => {
    const objects = [
      {
        uid: "episode-1",
        data_source_id: "airtable-episode-1",
        self: "/api/episodes/episode-1",
      },
    ] as ApiBaseObject[];

    it("sets the credits to [] when none exist in Airtable", async () => {
      // Arrange
      const record: Partial<Record<FieldSet>> = {
        id: "airtable-episode-1",
        _table: { name: "episodes" } as Table<FieldSet>,
        fields: { uid: "episode-1", title_short: "short title" },
      };
      const data: ApiBatchResponse[] = [
        {
          code: 200,
          id: record.id as string,
          header: {},
          // url: `/api/episodes/${record.fields?.uid as string}`,
          body: "{}",
        },
      ];

      axiosRequest.mockImplementation(() => ({ data }));

      // Act
      await updateCredits(objects, [record] as Record<FieldSet>[], metadata);

      // Assert
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          method: "POST",
          url: "https://skylarkplatform.io/api/batch/",
          data: [
            {
              id: "CREDITS-episode-1",
              method: "PATCH",
              url: "/api/episodes/episode-1",
              data: JSON.stringify({
                credits: [],
              }),
            },
          ],
        })
      );
    });

    it("adds credits when they exist in Airtable", async () => {
      // Arrange
      const metadataWithCredits: Metadata = {
        ...metadata,
        people: [
          {
            airtableId: "airtable-person-1",
            name: "person-1",
            uid: "people_1",
            slug: "person-1",
            self: "/api/people/people_1",
          },
        ],
        roles: [
          {
            airtableId: "airtable-role-1",
            title: "role-1",
            uid: "role_1",
            self: "/api/roles/role_1",
          } as unknown as ApiRole & ApiAirtableFields,
        ],
        airtableCredits: [
          {
            id: "airtable-credit-1",
            fields: {
              person: ["airtable-person-1"],
              role: ["airtable-role-1"],
              character: "character",
            } as object,
          } as Record<FieldSet>,
        ],
      };
      const record: Partial<Record<FieldSet>> = {
        id: "airtable-episode-1",
        _table: { name: "episodes" } as Table<FieldSet>,
        fields: {
          uid: "episode-1",
          title_short: "short title",
          credits: ["airtable-credit-1"],
        },
      };
      const data: ApiBatchResponse[] = [
        {
          code: 200,
          id: record.id as string,
          header: {},
          // url: `/api/episodes/${record.fields?.uid as string}`,
          body: "{}",
        },
      ];

      axiosRequest.mockImplementation(() => ({ data }));

      // Act
      await updateCredits(
        objects,
        [record] as Record<FieldSet>[],
        metadataWithCredits
      );

      // Assert
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          method: "POST",
          url: "https://skylarkplatform.io/api/batch/",
          data: [
            {
              id: "CREDITS-episode-1",
              method: "PATCH",
              url: "/api/episodes/episode-1",
              data: JSON.stringify({
                credits: [
                  {
                    people_url: metadataWithCredits.people[0].self,
                    role_url: metadataWithCredits.roles[0].self,
                    character: "character",
                  },
                ],
              }),
            },
          ],
        })
      );
    });
  });

  describe("createOrUpdateAirtableObjectsInSkylark", () => {
    const table = { name: "episodes" } as Table<FieldSet>;
    const airtableEpisodeRecords: Partial<Record<FieldSet>>[] = [
      {
        id: "airtable-episode-1",
        _table: table,
        fields: { slug: "episode-1", title_short: "short title" },
      },
      {
        id: "airtable-episode-2",
        _table: table,
        fields: { slug: "episode-2", synopsis_short: "short synopsis" },
      },
    ];

    it("Makes a GET request to check if the Airtable records match objects that exist in Skylark", async () => {
      // Arrange.
      const data: ApiBatchResponse[] = airtableEpisodeRecords.map((record) => ({
        code: 200,
        id: record.id as string,
        header: {},
        url: `/api/episodes/?slug=${record.fields?.slug as string}`,
        body: "{}",
      }));
      axiosRequest.mockImplementation(() => ({ data }));

      // Act.
      await createOrUpdateAirtableObjectsInSkylark(
        airtableEpisodeRecords as Record<FieldSet>[],
        metadata
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          method: "POST",
          url: "https://skylarkplatform.io/api/batch/",
          data: [
            {
              id: "airtable-episode-1",
              method: "GET",
              url: "/api/episodes/versions/data-source/airtable-episode-1/",
            },
            {
              id: "airtable-episode-2",
              method: "GET",
              url: "/api/episodes/versions/data-source/airtable-episode-2/",
            },
          ],
        })
      );
    });

    it("Makes a PUT request to create records that don't match existing objects in Skylark", async () => {
      // Arrange.
      const getData: ApiBatchResponse[] = airtableEpisodeRecords.map(
        (record) => ({
          code: 404,
          id: record.id as string,
          header: {},
          url: `/api/episodes/versions/data-source/${record.id as string}`,
          body: "{}",
        })
      );
      const postData: ApiBatchResponse[] = airtableEpisodeRecords.map(
        (record) => ({
          code: 200,
          id: record.id as string,
          header: {},
          url: `/api/episodes/versions/data-source/${record.id as string}`,
          body: "{}",
        })
      );
      axiosRequest.mockImplementation(() => {
        if (axiosRequest.mock.calls.length <= 1) {
          return { data: getData };
        }
        return { data: postData };
      });

      // Act.
      await createOrUpdateAirtableObjectsInSkylark(
        airtableEpisodeRecords as Records<FieldSet>,
        metadata
      );

      // Assert.
      expect(axiosRequest).nthCalledWith(
        2,
        expect.objectContaining({
          method: "POST",
          url: "https://skylarkplatform.io/api/batch/",
          data: [
            {
              data: JSON.stringify({
                uid: "",
                self: "",
                slug: "episode-1",
                title_short: "short title",
                schedule_urls: ["/api/schedules/1"],
                data_source_id: "airtable-episode-1",
                tags: [],
                data_source_fields: [
                  "uid",
                  "self",
                  "name",
                  "title",
                  "slug",
                  "title_short",
                  "title_medium",
                  "title_long",
                  "synopsis_short",
                  "synopsis_medium",
                  "synopsis_long",
                  "release_date",
                  "parent_url",
                  "schedule_urls",
                  "season_number",
                  "number_of_episodes",
                  "episode_number",
                  "value",
                  "tags",
                ],
              }),
              id: "PUT-/api/episodes/versions/data-source/airtable-episode-1/",
              method: "PUT",
              url: "/api/episodes/versions/data-source/airtable-episode-1/",
            },
            {
              data: JSON.stringify({
                uid: "",
                self: "",
                slug: "episode-2",
                synopsis_short: "short synopsis",
                schedule_urls: ["/api/schedules/1"],
                data_source_id: "airtable-episode-2",
                tags: [],
                data_source_fields: [
                  "uid",
                  "self",
                  "name",
                  "title",
                  "slug",
                  "title_short",
                  "title_medium",
                  "title_long",
                  "synopsis_short",
                  "synopsis_medium",
                  "synopsis_long",
                  "release_date",
                  "parent_url",
                  "schedule_urls",
                  "season_number",
                  "number_of_episodes",
                  "episode_number",
                  "value",
                  "tags",
                ],
              }),
              id: "PUT-/api/episodes/versions/data-source/airtable-episode-2/",
              method: "PUT",
              url: "/api/episodes/versions/data-source/airtable-episode-2/",
            },
          ],
        })
      );
    });

    it("Makes a PUT request to update records that match existing objects in Skylark", async () => {
      // Arrange.
      const getData: ApiBatchResponse[] = airtableEpisodeRecords.map(
        (record) => ({
          code: 200,
          id: record.id as string,
          header: {},
          url: `/api/episodes/versions/data-source/${record.id as string}`,
          body: JSON.stringify({
            ...record.fields,
            uid: record.fields?.slug,
            self: `/api/episodes/${record.fields?.slug as string}`,
          }),
        })
      );
      const patchData: ApiBatchResponse[] = airtableEpisodeRecords.map(
        (record) => ({
          code: 200,
          id: record.id as string,
          header: {},
          url: `/api/episodes/versions/data-source/${record.id as string}`,
          body: "{}",
        })
      );
      axiosRequest.mockImplementation(() => {
        if (axiosRequest.mock.calls.length <= 1) {
          return { data: getData };
        }
        return { data: patchData };
      });

      // Act.
      await createOrUpdateAirtableObjectsInSkylark(
        airtableEpisodeRecords as Record<FieldSet>[],
        metadata
      );

      // Assert.
      expect(axiosRequest).nthCalledWith(
        2,
        expect.objectContaining({
          method: "POST",
          url: "https://skylarkplatform.io/api/batch/",
          data: [
            {
              data: JSON.stringify({
                slug: "episode-1",
                title_short: "short title",
                uid: "episode-1",
                self: "/api/episodes/episode-1",
                schedule_urls: ["/api/schedules/1"],
                data_source_id: "airtable-episode-1",
                tags: [],
                data_source_fields: [
                  "uid",
                  "self",
                  "name",
                  "title",
                  "slug",
                  "title_short",
                  "title_medium",
                  "title_long",
                  "synopsis_short",
                  "synopsis_medium",
                  "synopsis_long",
                  "release_date",
                  "parent_url",
                  "schedule_urls",
                  "season_number",
                  "number_of_episodes",
                  "episode_number",
                  "value",
                  "tags",
                ],
              }),
              id: "PUT-/api/episodes/versions/data-source/airtable-episode-1/",
              method: "PUT",
              url: "/api/episodes/versions/data-source/airtable-episode-1/",
            },
            {
              data: JSON.stringify({
                slug: "episode-2",
                synopsis_short: "short synopsis",
                uid: "episode-2",
                self: "/api/episodes/episode-2",
                schedule_urls: ["/api/schedules/1"],
                data_source_id: "airtable-episode-2",
                tags: [],
                data_source_fields: [
                  "uid",
                  "self",
                  "name",
                  "title",
                  "slug",
                  "title_short",
                  "title_medium",
                  "title_long",
                  "synopsis_short",
                  "synopsis_medium",
                  "synopsis_long",
                  "release_date",
                  "parent_url",
                  "schedule_urls",
                  "season_number",
                  "number_of_episodes",
                  "episode_number",
                  "value",
                  "tags",
                ],
              }),
              id: "PUT-/api/episodes/versions/data-source/airtable-episode-2/",
              method: "PUT",
              url: "/api/episodes/versions/data-source/airtable-episode-2/",
            },
          ],
        })
      );
    });
  });

  describe("createOrUpdateAirtableObjectsInSkylarkWithParentsInSameTable", () => {
    const table = { name: "episodes" } as Table<FieldSet>;
    const airtableEpisodeRecords: Partial<Record<FieldSet>>[] = [
      {
        id: "airtable-episode-1",
        _table: table,
        fields: { slug: "episode-1", title_short: "short title" },
      },
      {
        id: "airtable-episode-2",
        _table: table,
        fields: { slug: "episode-2", synopsis_short: "short synopsis" },
      },
    ];

    it("does nothing when no airtable records are given", async () => {
      const records =
        await createOrUpdateAirtableObjectsInSkylarkWithParentsInSameTable(
          [],
          metadata
        );
      expect(records).toEqual([]);
    });

    it("calls Axios twice when all records don't have parents", async () => {
      // Arrange.
      const getData: ApiBatchResponse[] = airtableEpisodeRecords.map(
        (record) => ({
          code: 200,
          id: record.id as string,
          header: {},
          url: `/api/episodes/versions/data-source/${record.id as string}`,
          body: JSON.stringify({
            ...record.fields,
            uid: record.fields?.slug,
            self: `/api/episodes/${record.fields?.slug as string}`,
          }),
        })
      );
      const patchData: ApiBatchResponse[] = airtableEpisodeRecords.map(
        (record) => ({
          code: 200,
          id: record.id as string,
          header: {},
          url: `/api/episodes/versions/data-source/${record.id as string}`,
          body: "{}",
        })
      );
      axiosRequest.mockImplementation(() => {
        if (axiosRequest.mock.calls.length <= 1) {
          return { data: getData };
        }
        return { data: patchData };
      });

      // Act.
      await createOrUpdateAirtableObjectsInSkylarkWithParentsInSameTable(
        airtableEpisodeRecords as Record<FieldSet>[],
        metadata
      );

      // Assert.
      expect(axiosRequest).toHaveBeenCalledTimes(2);
    });

    it("calls Axios five times when one record has a parent", async () => {
      // Arrange.
      const data: ApiBatchResponse[] = airtableEpisodeRecords.map((record) => ({
        code: 200,
        id: record.id as string,
        header: {},
        url: `/api/episodes/versions/data-source/${record.id as string}`,
        body: JSON.stringify({
          ...record.fields,
          data_source_id: record.id,
          uid: record.fields?.slug,
          self: `/api/episodes/${record.fields?.slug as string}`,
          credits: [],
        }),
      }));
      axiosRequest.mockImplementation(() => ({ data }));

      const airtableRecordsWithParentField = [
        ...airtableEpisodeRecords,
        {
          id: "airtable-episode-3",
          _table: table,
          fields: {
            slug: "episode-3",
            synopsis_short: "short synopsis",
            parent: ["airtable-episode-1"],
          },
        },
      ];

      // Act.
      await createOrUpdateAirtableObjectsInSkylarkWithParentsInSameTable(
        airtableRecordsWithParentField as Record<FieldSet>[],
        metadata
      );

      // Assert.
      expect(axiosRequest).toHaveBeenCalledTimes(5);
      expect(axiosRequest).toHaveBeenNthCalledWith(
        5,
        expect.objectContaining({
          method: "POST",
          url: "https://skylarkplatform.io/api/batch/",
          data: [
            {
              data: JSON.stringify({
                uid: "",
                self: "",
                slug: "episode-3",
                synopsis_short: "short synopsis",
                parent_url: "/api/episodes/episode-1",
                schedule_urls: ["/api/schedules/1"],
                data_source_id: "airtable-episode-3",
                tags: [],
                data_source_fields: [
                  "uid",
                  "self",
                  "name",
                  "title",
                  "slug",
                  "title_short",
                  "title_medium",
                  "title_long",
                  "synopsis_short",
                  "synopsis_medium",
                  "synopsis_long",
                  "release_date",
                  "parent_url",
                  "schedule_urls",
                  "season_number",
                  "number_of_episodes",
                  "episode_number",
                  "value",
                  "tags",
                ],
              }),
              id: "PUT-/api/episodes/versions/data-source/airtable-episode-3/",
              method: "PUT",
              url: "/api/episodes/versions/data-source/airtable-episode-3/",
            },
          ],
        })
      );
    });

    it("calls Axios thrice when a Record with a parent is given, but the parent doesn't exist", async () => {
      // Arrange.
      const data: ApiBatchResponse[] = airtableEpisodeRecords.map((record) => ({
        code: 200,
        id: record.id as string,
        header: {},
        url: `/api/episodes/versions/data-source/${record.id as string}`,
        body: JSON.stringify({
          ...record.fields,
          data_source_id: record.id,
          uid: record.fields?.slug,
          self: `/api/episodes/${record.fields?.slug as string}`,
          credits: [],
        }),
      }));
      axiosRequest.mockImplementation(() => ({ data }));

      const airtableRecordsWithParentField = [
        ...airtableEpisodeRecords,
        {
          id: "airtable-episode-3",
          _table: table,
          fields: {
            slug: "episode-3",
            synopsis_short: "short synopsis",
            parent: ["does-not-exist"],
          },
        },
      ];

      // Act.
      await createOrUpdateAirtableObjectsInSkylarkWithParentsInSameTable(
        airtableRecordsWithParentField as Record<FieldSet>[],
        metadata
      );

      // Assert.
      expect(axiosRequest).toHaveBeenCalledTimes(3);
    });
  });

  describe("createTranslationsForObjects", () => {
    const originalObjects: ApiEntertainmentObjectWithAirtableId[] = [
      {
        uid: "episode-1",
        self: "/api/episodes/episode-1",
        title: "episode 1",
        slug: "episode-1",
        airtableId: "airtable-episode-1",
        title_short: "Episode 1",
      },
    ];

    const airtableTranslations: Partial<Record<FieldSet>>[] = [
      {
        id: "airtable-episode-1-pt-pt",
        fields: {
          object: ["airtable-episode-1"],
          slug: "episode-1",
          title_short: "título curto",
          languages: [metadata.dimensions.languages[0].airtableId],
        },
      },
    ];

    it("calls Axios with the new language request", async () => {
      await createTranslationsForObjects(
        originalObjects,
        airtableTranslations as Records<FieldSet>,
        metadata
      );
      expect(axiosRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "PATCH",
          url: "https://skylarkplatform.io/api/episodes/episode-1",
          headers: {
            "Accept-Language": "pt-pt",
            Authorization: "Bearer token",
            "Cache-Control": "no-cache",
          },
          data: {
            data_source_id: "airtable-episode-1",
            self: "/api/episodes/episode-1",
            slug: "episode-1",
            title_short: "título curto",
            uid: "episode-1",
          },
        })
      );
    });

    it("does not update relationships", async () => {
      await createTranslationsForObjects(
        originalObjects,
        [
          {
            ...airtableTranslations[0],
            fields: {
              ...airtableTranslations[0].fields,
              themes: ["theme"],
              tags: ["tags"],
              genres: ["genres"],
            },
          },
        ] as Records<FieldSet>,
        metadata
      );

      expect(axiosRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            data_source_id: "airtable-episode-1",
            self: "/api/episodes/episode-1",
            slug: "episode-1",
            title_short: "título curto",
            uid: "episode-1",
          },
        })
      );
    });
  });

  describe("connectExternallyCreatedAssetToMediaObject", () => {
    const externalAssetDataSourceId = "asset-1";

    const episode: ApiEntertainmentObjectWithAirtableId = {
      airtableId: "airtable-episode-1",
      data_source_id: "airtable-episode-1",
      uid: "episode-1",
      self: "/api/episodes/episode-1",
      slug: "episode-1",
      title: "Episode 1",
    };

    const records: Partial<Record<FieldSet>>[] = [
      {
        id: episode.airtableId,
        fields: {
          title: "airtable-episode-with-external-asset",
          external_asset_data_source_id: "asset-1",
        },
      },
      {
        id: "airtable-episode-2",
        fields: {
          title: "airtable-episode-without-external-asset",
        },
      },
    ];

    it("makes with a GET request to check if the external_asset_data_source_id exists in Skylark", async () => {
      const data: ApiBatchResponse[] = [
        {
          code: 200,
          id: `GET-${externalAssetDataSourceId}`,
          header: {},
          body: JSON.stringify({
            data_source_id: externalAssetDataSourceId,
            uid: "asset-1",
            self: "/api/asset/asset-1",
          }),
        },
      ];
      axiosRequest.mockImplementation(() => ({ data }));

      await connectExternallyCreatedAssetToMediaObject(
        records as Records<FieldSet>,
        [],
        metadata
      );

      expect(axiosRequest).toBeCalledTimes(1);
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          method: "POST",
          url: "https://skylarkplatform.io/api/batch/",
          data: [
            {
              id: `GET-${externalAssetDataSourceId}`,
              method: "GET",
              url: `/api/assets/versions/data-source/${externalAssetDataSourceId}/`,
            },
          ],
        })
      );
    });

    it("makes a PATCH request", async () => {
      const data: ApiBatchResponse[] = [
        {
          code: 200,
          id: `GET-${externalAssetDataSourceId}`,
          header: {},
          body: JSON.stringify({
            data_source_id: externalAssetDataSourceId,
            uid: "asset-1",
            self: "/api/asset/asset-1",
          }),
        },
      ];
      axiosRequest.mockImplementation(() => ({ data }));

      await connectExternallyCreatedAssetToMediaObject(
        records as Records<FieldSet>,
        [episode],
        metadata
      );

      expect(axiosRequest).toBeCalledTimes(2);
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          method: "POST",
          url: "https://skylarkplatform.io/api/batch/",
          data: [
            {
              id: `PATCH-${externalAssetDataSourceId}-${episode.self}`,
              method: "PATCH",
              url: `/api/asset/asset-1`,
              data: JSON.stringify({
                parent_url: episode.self,
                schedule_urls: [metadata.schedules.always.self],
              }),
            },
          ],
        })
      );
    });

    it("does not make a PATCH request when the parent_url for the asset is already correct", async () => {
      const data: ApiBatchResponse[] = [
        {
          code: 200,
          id: `GET-${externalAssetDataSourceId}`,
          header: {},
          body: JSON.stringify({
            data_source_id: externalAssetDataSourceId,
            uid: "asset-1",
            self: "/api/asset/asset-1",
            parent_url: episode.self,
          }),
        },
      ];
      axiosRequest.mockImplementation(() => ({ data }));

      await connectExternallyCreatedAssetToMediaObject(
        records as Records<FieldSet>,
        [episode],
        metadata
      );

      expect(axiosRequest).toBeCalledTimes(1);
      expect(axiosRequest).not.toBeCalledWith(
        expect.objectContaining({
          method: "POST",
          url: "https://skylarkplatform.io/api/batch/",
          data: [
            {
              id: `PATCH-${externalAssetDataSourceId}-${episode.self}`,
              method: "PATCH",
              url: `/api/assets/versions/data-source/${externalAssetDataSourceId}/`,
              data: JSON.stringify({
                parent_url: episode.self,
                schedule_urls: [metadata.schedules.always.self],
              }),
            },
          ],
        })
      );
    });

    it("does not make a PATCH request when an asset matching the external_asset_data_source_id exists in Skylark", async () => {
      const data: ApiBatchResponse[] = [
        {
          code: 404,
          id: `GET-${externalAssetDataSourceId}`,
          header: {},
          body: "",
        },
      ];
      axiosRequest.mockImplementation(() => ({ data }));

      await connectExternallyCreatedAssetToMediaObject(
        records as Records<FieldSet>,
        [episode],
        metadata
      );

      expect(axiosRequest).toBeCalledTimes(1);
    });
  });
});
