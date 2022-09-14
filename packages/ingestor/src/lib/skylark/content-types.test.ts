import Auth from "@aws-amplify/auth";
import { FieldSet, Record } from "airtable";
import axios from "axios";
import { Metadata } from "../../interfaces";
import { createOrUpdateContentTypes } from "./content-types";

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

describe("content-types", () => {
  let axiosRequest: jest.Mock;

  const metadata: Metadata = {
    airtableCredits: [],
    airtableImages: [],
    genres: [],
    themes: [],
    imageTypes: [],
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
      languages: [],
      locales: [],
      operatingSystems: [],
      regions: [],
      viewingContext: [],
    },
  };

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

  describe("createOrUpdateContentTypes", () => {
    const records: Partial<Record<FieldSet>>[] = [
      {
        id: "airtable-content-type-1",
        fields: { name: "content-type-1", slug: "content-type-1" },
      },
    ];

    it("makes a GET request to fetch all of the content types with no API filter", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({ data: {} }));

      // Act.
      await createOrUpdateContentTypes(
        "asset-types",
        records as Record<FieldSet>[],
        metadata
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          method: "GET",
          url: "https://skylarkplatform.io/api/asset-types/",
        })
      );
    });

    it("makes a POST request to create a content-type when it isn't found in Skylark", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({ data: {} }));

      // Act.
      await createOrUpdateContentTypes(
        "asset-types",
        records as Record<FieldSet>[],
        metadata
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          method: "POST",
          url: "https://skylarkplatform.io/api/asset-types/",
          data: {
            uid: "",
            self: "",
            schedule_urls: [metadata.schedules.always.self],
            data_source_id: records[0].id,
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
            ],
            ...records[0].fields,
          },
        })
      );
    });

    it("makes a PUT request to update a content-type that exists in Skylark", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({
        data: { objects: [{ ...records[0].fields, uid: "content-type_1" }] },
      }));

      // Act.
      await createOrUpdateContentTypes(
        "asset-types",
        records as Record<FieldSet>[],
        metadata
      );

      // Assert.
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          method: "PUT",
          url: "https://skylarkplatform.io/api/asset-types/content-type_1",
          data: {
            uid: "content-type_1",
            self: "",
            schedule_urls: [metadata.schedules.always.self],
            data_source_id: records[0].id,
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
            ],
            ...records[0].fields,
          },
        })
      );
    });

    it("returns the Skylark objects with airtable ID", async () => {
      // Arrange.
      axiosRequest.mockImplementation(() => ({
        data: { ...records[0].fields, uid: "content-type_1" },
      }));

      // Act.
      const got = await createOrUpdateContentTypes(
        "asset-types",
        records as Record<FieldSet>[],
        metadata
      );

      // Assert.
      expect(got).toEqual([
        {
          ...records[0].fields,
          uid: "content-type_1",
          airtableId: records[0].id,
        },
      ]);
    });
  });
});
