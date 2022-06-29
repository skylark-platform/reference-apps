import { Metadata } from "../../interfaces";

/**
 * getScheduleUrlsFromMetadata - returns an array of schedules using their Airtable IDs, defaults to the default schedule if none are found
 * @param schedules schedule IDs from Airtable
 * @param metadataSchedules object containing default schedule and all Airtable schedules added to Skylark
 * @returns array of Skylark schedules
 */
export const getScheduleUrlsFromMetadata = (
  schedules: string[],
  metadataSchedules: Metadata["schedules"]
): string[] => {
  const scheduleUrls =
    schedules && schedules.length > 0
      ? metadataSchedules.all
          .filter(({ airtableId: scheduleAirtableId }) =>
            schedules.includes(scheduleAirtableId)
          )
          .map(({ self }) => self)
      : [metadataSchedules.default.self];
  return scheduleUrls;
};
