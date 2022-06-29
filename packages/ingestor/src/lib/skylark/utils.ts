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

/**
 * Removes undefined properties from an object
 * The TypeScript around this is a bit awkward because its designed to be generic
 * @param object - An object which may have properties that are undefined
 * @returns - An object that has no undefined keys
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeUndefinedPropertiesFromObject = <T>(object: {
  [key: string]: any;
}) => {
  // eslint-disable-next-line no-param-reassign
  Object.keys(object).forEach(
    (key) => object[key] === undefined && delete object[key]
  );
  return object as unknown as T;
};
