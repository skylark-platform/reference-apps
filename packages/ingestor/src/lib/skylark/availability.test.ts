import Auth from "@aws-amplify/auth";
import { ApiSchedule } from "@skylark-reference-apps/lib";
import { FieldSet, Record } from "airtable";
import axios, { AxiosRequestConfig } from "axios";
import { Airtables, Metadata } from "../../interfaces";
import {
  createOrUpdateScheduleDimensions,
  createOrUpdateSchedules,
  getAlwaysSchedule,
} from "./availability";

jest.mock("axios");
jest.mock("@aws-amplify/auth");
jest.mock("@skylark-reference-apps/lib", () => ({
  SKYLARK_API: "https://skylarkplatform.io",
}));

const dimensions = [
  "affiliates",
  "customer-types",
  "device-types",
  "languages",
  "locales",
  "operating-systems",
  "regions",
  "viewing-context",
];

const fields = {
  name: "dimension",
  slug: "slug",
};

const record: object = {
  id: "",
  fields,
};

const airtableDimensions: Airtables["dimensions"] = {
  affiliates: [record as Record<FieldSet>],
  customerTypes: [record as Record<FieldSet>],
  deviceTypes: [record as Record<FieldSet>],
  languages: [record as Record<FieldSet>],
  locales: [record as Record<FieldSet>],
  operatingSystems: [record as Record<FieldSet>],
  regions: [record as Record<FieldSet>],
  viewingContext: [record as Record<FieldSet>],
};

const skylarkDimensions: Metadata["dimensions"] = {
  affiliates: [
    {
      airtableId: "1",
      name: "affiliate 1",
      uid: "affiliate_1",
      slug: "affiliate-1",
      self: "/api/affiliates/affiliate_1",
    },
  ],
  customerTypes: [
    {
      airtableId: "2",
      name: "VOD",
      uid: "customer_1",
      slug: "vod",
      self: "/api/customer-types/customer_1",
    },
  ],
  deviceTypes: [
    {
      airtableId: "3",
      name: "PC",
      uid: "device_1",
      slug: "pc",
      self: "/api/device-types/device_1",
    },
  ],
  languages: [
    {
      airtableId: "4",
      name: "English",
      uid: "language_1",
      slug: "english",
      self: "/api/languages/language_1",
    },
  ],
  locales: [
    {
      airtableId: "5",
      name: "United Kingdom",
      uid: "locale_1",
      slug: "united-kingdom",
      self: "/api/locales/locale_1",
    },
  ],
  operatingSystems: [
    {
      airtableId: "6",
      name: "MacOS",
      uid: "operating_system_1",
      slug: "macos",
      self: "/api/operating-systems/operating_system_1",
    },
  ],
  regions: [
    {
      airtableId: "7",
      name: "Europe",
      uid: "region_1",
      slug: "europe",
      self: "/api/regions/region_1",
    },
  ],
  viewingContext: [
    {
      airtableId: "8",
      name: "context",
      uid: "viewing_1",
      slug: "context",
      self: "/api/viewing-context/viewing_1",
    },
  ],
};

describe("skylark.availibility", () => {
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

  describe("getAlwaysSchedule", () => {
    it("returns the always schedule when it is found", async () => {
      const schedule: ApiSchedule = {
        uid: "1",
        self: "/api/schedule/1",
        rights: false,
        starts: "1/1/2000",
        ends: "1/1/2000",
        slug: "always",
        title: "always-scheduled",
        status: "enabled",
        affiliate_urls: [],
        customer_type_urls: [],
        device_type_urls: [],
        language_urls: [],
        locale_urls: [],
        operating_system_urls: [],
        region_urls: [],
        viewing_context_urls: [],
      };
      axiosRequest.mockResolvedValue({ data: { objects: [schedule] } });
      const got = await getAlwaysSchedule();

      expect(got).toEqual(schedule);
    });

    it("throws an error when the schedule is not found", async () => {
      axiosRequest.mockResolvedValue({ data: { objects: [] } });

      await expect(getAlwaysSchedule()).rejects.toThrow(
        "Always schedule not found"
      );
    });
  });

  describe("createOrUpdateScheduleDimensions", () => {
    it("makes a GET request to every dimension endpoint", async () => {
      await createOrUpdateScheduleDimensions(airtableDimensions);

      // eslint-disable-next-line no-restricted-syntax
      for (const dimension of dimensions) {
        expect(axiosRequest).toBeCalledWith(
          expect.objectContaining({
            url: `https://skylarkplatform.io/api/dimensions/${dimension}/?slug=slug`,
            method: "GET",
          })
        );
      }
    });

    it("makes a POST request to every dimension endpoint when the dimension doesn't exist", async () => {
      await createOrUpdateScheduleDimensions(airtableDimensions);

      // eslint-disable-next-line no-restricted-syntax
      for (const dimension of dimensions) {
        expect(axiosRequest).toBeCalledWith(
          expect.objectContaining({
            url: `https://skylarkplatform.io/api/dimensions/${dimension}/`,
            data: fields,
            method: "POST",
          })
        );
      }
    });

    it("makes a PUT request to every dimension endpoint when the dimension already exists in Skylark", async () => {
      // Arrange.
      axiosRequest.mockImplementation(({ method }: AxiosRequestConfig) => {
        if (method === "GET") {
          return {
            data: {
              objects: [{ id: "1", self: "/api/1", ...fields }],
            },
          };
        }

        return { data: {} };
      });

      // Act.
      await createOrUpdateScheduleDimensions(airtableDimensions);

      // Assert.
      // eslint-disable-next-line no-restricted-syntax
      for (const dimension of dimensions) {
        expect(axiosRequest).toBeCalledWith(
          expect.objectContaining({
            url: `https://skylarkplatform.io/api/dimensions/${dimension}/`,
            data: {
              self: "/api/1",
              id: "1",
              ...fields,
            },
            method: "PUT",
          })
        );
      }
    });

    it("throws an error when Axios throws", async () => {
      axiosRequest.mockImplementationOnce(() => {
        throw new Error("dimension request failed");
      });

      await expect(
        createOrUpdateScheduleDimensions(airtableDimensions)
      ).rejects.toThrow("dimension request failed");
    });
  });

  describe("createOrUpdateSchedules", () => {
    const schedule = {
      title: "Schedule 1",
      uid: "1",
      slug: "schedule-1",
    };

    const scheduleRecords: object = {
      id: "airtable-schedule-1",
      fields: schedule,
    };

    it("does nothing when there are no schedules in Airtable", async () => {
      await createOrUpdateSchedules([], skylarkDimensions);
      expect(axiosRequest).not.toBeCalled();
    });

    it("checks to see if the Airtable schedule already exists in Skylark using the slug", async () => {
      await createOrUpdateSchedules(
        [scheduleRecords as Record<FieldSet>],
        skylarkDimensions
      );
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: `https://skylarkplatform.io/api/schedules/?slug=schedule-1`,
          method: "GET",
        })
      );
    });

    it("creates a new schedule when one with a matching slug does not exist", async () => {
      axiosRequest.mockImplementation(() => ({ data: {} }));

      await createOrUpdateSchedules(
        [scheduleRecords as Record<FieldSet>],
        skylarkDimensions
      );
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: `https://skylarkplatform.io/api/schedules/`,
          method: "POST",
        })
      );
    });

    it("updates a schedule when one with a matching slug exists", async () => {
      axiosRequest.mockImplementation(({ method }: AxiosRequestConfig) => {
        if (method === "GET") {
          return {
            data: {
              objects: [{ uid: "1", self: "/api/1", ...fields }],
            },
          };
        }

        return { data: {} };
      });

      await createOrUpdateSchedules(
        [scheduleRecords as Record<FieldSet>],
        skylarkDimensions
      );
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: `https://skylarkplatform.io/api/schedules/1`,
          method: "PUT",
        })
      );
    });

    it("converts all the dimensions into an array of URLs", async () => {
      axiosRequest.mockImplementation(() => ({ data: {} }));
      const scheduleWithDimensions = {
        ...schedule,
        affiliates: [skylarkDimensions.affiliates[0].airtableId],
        customers: [skylarkDimensions.customerTypes[0].airtableId],
        devices: [skylarkDimensions.deviceTypes[0].airtableId],
        languages: [skylarkDimensions.languages[0].airtableId],
        locales: [skylarkDimensions.locales[0].airtableId],
        "operating-systems": [skylarkDimensions.operatingSystems[0].airtableId],
        regions: [skylarkDimensions.regions[0].airtableId],
        "viewing-context": [skylarkDimensions.viewingContext[0].airtableId],
      };

      const scheduleRecordWithDimension: object = {
        id: "airtable-schedule-2",
        fields: scheduleWithDimensions,
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data: object = expect.objectContaining({
        affiliate_urls: [skylarkDimensions.affiliates[0].self],
        customer_type_urls: [skylarkDimensions.customerTypes[0].self],
        device_type_urls: [skylarkDimensions.deviceTypes[0].self],
        language_urls: [skylarkDimensions.languages[0].self],
        locale_urls: [skylarkDimensions.locales[0].self],
        operating_system_urls: [skylarkDimensions.operatingSystems[0].self],
        region_urls: [skylarkDimensions.regions[0].self],
      });

      await createOrUpdateSchedules(
        [scheduleRecordWithDimension as Record<FieldSet>],
        skylarkDimensions
      );
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: `https://skylarkplatform.io/api/schedules/`,
          method: "POST",
          data,
        })
      );
    });

    it("sets rights to true when the airtable schedule is of type license", async () => {
      axiosRequest.mockImplementation(() => ({ data: {} }));
      const scheduleWithDimensions = {
        ...schedule,
        type: "license",
      };

      const scheduleRecordWithDimension: object = {
        id: "airtable-schedule-2",
        fields: scheduleWithDimensions,
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data: object = expect.objectContaining({
        rights: true,
      });

      await createOrUpdateSchedules(
        [scheduleRecordWithDimension as Record<FieldSet>],
        skylarkDimensions
      );
      expect(axiosRequest).toBeCalledWith(
        expect.objectContaining({
          url: `https://skylarkplatform.io/api/schedules/`,
          method: "POST",
          data,
        })
      );
    });
  });
});
