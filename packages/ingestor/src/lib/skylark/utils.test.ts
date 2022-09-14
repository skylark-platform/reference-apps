import { Metadata } from "../../interfaces";
import {
  getScheduleUrlsFromMetadata,
  removeUndefinedPropertiesFromObject,
} from "./utils";

describe("utils", () => {
  describe("getScheduleUrlsFromMetadata", () => {
    const alwaysLicense = {
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

    const metadataSchedules: Metadata["schedules"] = {
      default: alwaysLicense,
      always: alwaysLicense,
      all: [
        {
          airtableId: "airtable-schedule-1",
          uid: "airtable-schedule-1",
          slug: "airtable-schedule-1",
          title: "Airtable schedule 1",
          starts: "1/1/2000",
          ends: "1/1/2000",
          rights: false,
          status: "active",
          self: "/api/schedules/airtable-schedule-1",
          affiliate_urls: [],
          customer_type_urls: [],
          device_type_urls: [],
          language_urls: [],
          locale_urls: [],
          operating_system_urls: [],
          region_urls: [],
          viewing_context_urls: [],
        },
        {
          airtableId: "airtable-schedule-2",
          uid: "airtable-schedule-2",
          slug: "airtable-schedule-2",
          title: "Airtable schedule 2",
          starts: "1/1/2000",
          ends: "1/1/2000",
          rights: false,
          status: "active",
          self: "/api/schedules/airtable-schedule-2",
          affiliate_urls: [],
          customer_type_urls: [],
          device_type_urls: [],
          language_urls: [],
          locale_urls: [],
          operating_system_urls: [],
          region_urls: [],
          viewing_context_urls: [],
        },
      ],
    };
    it("returns the default schedule when there are no schedules on Airtable", () => {
      const schedules = getScheduleUrlsFromMetadata([], metadataSchedules);

      expect(schedules).toEqual([metadataSchedules.always.self]);
    });

    it("returns no schedule when there are an Airtable schedule is given but there are no schedules returned by Airtable", () => {
      const schedules = getScheduleUrlsFromMetadata(
        [metadataSchedules.all[0].airtableId],
        { ...metadataSchedules, all: [] }
      );

      expect(schedules).toEqual([]);
    });

    it("returns the requested schedules when there are an Airtable schedule is given and the schedules exist in Airtable", () => {
      const schedules = getScheduleUrlsFromMetadata(
        [
          metadataSchedules.all[0].airtableId,
          metadataSchedules.all[1].airtableId,
        ],
        metadataSchedules
      );

      expect(schedules).toEqual([
        metadataSchedules.all[0].self,
        metadataSchedules.all[1].self,
      ]);
    });
  });

  describe("removeUndefinedPropertiesFromObject", () => {
    it("removes any properties with undefined values from an object", () => {
      const obj = {
        title: "a title",
        undefinedProperty: undefined,
        nullProperty: null,
      };

      const got = removeUndefinedPropertiesFromObject(obj);

      expect(obj).toEqual({
        title: obj.title,
        nullProperty: obj.nullProperty,
        undefinedProperty: obj.undefinedProperty,
      });
      expect(got).toEqual({
        title: obj.title,
        nullProperty: obj.nullProperty,
      });
    });
  });
});
