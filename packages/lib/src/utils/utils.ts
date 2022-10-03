import dayjs from "dayjs";
import {
  Credit,
  Credits,
  CreditTypes,
  ImageTypes,
  ImageUrls,
  TitleTypes,
  UnexpandedObjects,
  SynopsisTypes,
} from "../interfaces";

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
  priority: TitleTypes[] = ["long", "medium", "short"],
  objectTitle?: string
): string => {
  if (!titles) return objectTitle || "";

  const foundType = priority.find((type) => titles[type] || null);

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
  priority: SynopsisTypes[] = ["long", "medium", "short"]
): string => {
  if (!synopsis) return "";

  const foundType = priority?.find((type) => synopsis[type] || null);

  return foundType ? synopsis[foundType] : "";
};

/**
 * getImageSrc - finds and returns the wanted type of image optionally with an added resize value
 * @param images {ImageUrls} - All images returned by Skylark
 * @param type {ImageTypes} - The image type to find and return
 * @param size {string} - Optional resize value in the form {height}x{width} e.g. (100x200)
 * @returns {string} the image URL or an empty string
 */
export const getImageSrc = (
  images: UnexpandedObjects | ImageUrls | undefined,
  type: ImageTypes,
  size?: string
): string => {
  if (!images || !images.isExpanded || images.items.length === 0) {
    return "";
  }

  // Filter any Images with an empty URL
  const imagesWithUrls = images.items.filter((img) => !!img?.url);
  if (imagesWithUrls.length === 0) {
    return "";
  }

  // Default to first image if no matching type is found
  const image =
    imagesWithUrls.find((img) => img.type === type) || imagesWithUrls[0];

  const urlWithoutExtension = image.url.replace(/\.[^/.]+$/, "");
  return size
    ? `${urlWithoutExtension}-${size}.jpg`
    : `${urlWithoutExtension}.jpg`;
};

/**
 * getCreditsByType - finds and returns all the credits that match a given type
 * @param credits {Credits}
 * @param type {CreditTypes}
 * @returns {Credit[]} an array of Credit
 */
export const getCreditsByType = (
  credits: UnexpandedObjects | Credits | undefined,
  type: CreditTypes
): Credit[] => {
  if (!credits || !credits.isExpanded) {
    return [];
  }

  return credits.items.filter((credit) => credit.roleUrl?.title === type);
};

/**
 * formatCredits - formats credits, adds character name if only a small amount of credits are given
 * @param credits
 * @returns string array
 */
export const formatCredits = (credits: Credit[]): string[] => {
  const showCharacterName = credits.length <= 4;
  return credits
    .map((credit) => {
      const name = credit?.peopleUrl?.name;
      if (!credit || !name) {
        return "";
      }

      return showCharacterName && credit.character
        ? `${name} as ${credit.character}`
        : name;
    })
    .filter((str) => !!str);
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
