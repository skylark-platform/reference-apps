import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TitleTypes, SynopsisTypes } from "../interfaces";

import "dayjs/locale/pt";
import { CLOUDINARY_ENVIRONMENT } from "../skylark";

dayjs.extend(customParseFormat);

/**
 * Returns the title from the titles object using a given order of priority
 * Defaults to long, medium, short
 * @param titles the titles object
 * @param priority order of priority
 * @param objectTitle optional objectTitle
 * @returns {string}
 */
export const getTitleByOrder = (
  titles: { [k in TitleTypes]?: string | null } | undefined,
  priority?: TitleTypes[],
  objectTitle?: string,
): string => {
  if (!titles) return objectTitle || "";

  const defaultPriority: TitleTypes[] = ["title", "title_short"];
  const foundType = (priority || defaultPriority).find((type) =>
    titles[type] && typeof titles[type] === "string" ? titles[type] : null,
  );

  return foundType ? (titles[foundType] as string) : objectTitle || "";
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
  priority?: SynopsisTypes[],
): string => {
  if (!synopsis) return "";

  const defaultPriority: SynopsisTypes[] = ["synopsis", "synopsis_short"];
  const foundType = (priority || defaultPriority).find(
    (type) => synopsis[type] || null,
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
  format = "MMMM D, YYYY",
): string => {
  const formattedDate = date
    ? dayjs(date, ["YYYY-MM-DD", "YYYY-MM-DDZ", "X", "x"])
        .locale(locale)
        .format(format)
    : "";

  return formattedDate;
};

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
  b: { number?: number },
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

export const hasProperty = <T, K extends PropertyKey, V = unknown>(
  object: T,
  property: K,
): object is T & Record<K, V> =>
  object && Object.prototype.hasOwnProperty.call(object, property);

export const addCloudinaryOnTheFlyImageTransformation = (
  imageUrl: string,
  opts: { height?: number; width?: number },
) => {
  // If the Cloudinary Environment is falsy, return the original image URL
  if (!imageUrl || !CLOUDINARY_ENVIRONMENT) {
    return imageUrl;
  }

  const urlOpts = [];
  if (opts.height) {
    urlOpts.push(`h_${opts.height}`);
  }
  if (opts.width) {
    urlOpts.push(`w_${opts.width}`);
  }

  if (opts.height && opts.width) {
    urlOpts.push("c_fill");
  }

  const urlOptsStr = urlOpts.length > 0 ? `${urlOpts.join(",")}/` : "";

  const cloudinaryUrl = `https://res.cloudinary.com/${CLOUDINARY_ENVIRONMENT}/image/fetch/${urlOptsStr}${imageUrl}`;
  return cloudinaryUrl;
};
