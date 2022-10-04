import dayjs from "dayjs";
import { TitleTypes, SynopsisTypes } from "../interfaces";

import "dayjs/locale/pt";

/**
 * Returns the title from the titles object using a given order of priority
 * Defaults to long, medium, short
 * @param titles the titles object
 * @param priority order of priority
 * @param objectTitle optional objectTitle
 * @returns {string}
 */
export const getTitleByOrder = (
  titles: { [k in TitleTypes]: string } | undefined,
  priority?: TitleTypes[],
  objectTitle?: string
): string => {
  if (!titles) return objectTitle || "";

  const defaultPriority: TitleTypes[] = ["long", "medium", "short"];
  const foundType = (priority || defaultPriority).find(
    (type) => titles[type] || null
  );

  return foundType ? titles[foundType] : objectTitle || "";
};

/**
 * Returns the synopsis from the synopsis object using a given order of priority
 * Defaults to long, medium, short
 * @param synopsis the synopsis object
 * @param priority optional order of priority
 * @returns {string}
 */
export const getSynopsisByOrder = (
  synopsis: { [s in SynopsisTypes]: string } | undefined,
  priority?: SynopsisTypes[]
): string => {
  if (!synopsis) return "";

  const defaultPriority: SynopsisTypes[] = ["long", "medium", "short"];
  const foundType = (priority || defaultPriority).find(
    (type) => synopsis[type] || null
  );

  return foundType ? synopsis[foundType] : "";
};

/**
 * formatReleaseDate - formats the release date
 * @param date date string
 * @param format optional format for the date
 * @returns string, empty if the date is empty
 */
export const formatReleaseDate = (
  date?: string,
  locale = "en-gb",
  format = "MMMM D, YYYY"
): string => (date ? dayjs(date).locale(locale).format(format) : "");

/**
 * formatYear - takes a date, returns the year
 * @param date date string
 * @returns string, empty if the date is empty
 */
export const formatYear = (date?: string, locale?: string) =>
  formatReleaseDate(date, locale, "YYYY");

/**
 * sortByNumber - to be passed into an array.sort
 * Using the number property, returns the array in ascending order
 */
export const sortObjectByNumberProperty = (
  a: { number?: number },
  b: { number?: number }
) => ((a.number || 0) > (b.number || 0) ? 1 : -1);

/**
 * sortArrayIntoAlphabeticalOrder - to be passed into an array.sort
 * Sorts strings into alphabetical order
 */
export const sortArrayIntoAlphabeticalOrder = (a: string, b: string) => {
  const aUpper = a.toUpperCase();
  const bUpper = b.toUpperCase();
  // eslint-disable-next-line no-nested-ternary
  return aUpper < bUpper ? -1 : aUpper > bUpper ? 1 : 0;
};
