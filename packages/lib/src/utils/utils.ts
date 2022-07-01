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

/**
 * Returns the title from the titles object using a given order of priority
 * @param titles the titles object
 * @param priority order of priority
 * @param objectTitle optional objectTitle
 * @returns {string}
 */
export const getTitleByOrder = (
  titles: { [k in TitleTypes]: string } | undefined,
  priority: TitleTypes[],
  objectTitle?: string
): string => {
  if (!titles) {
    return objectTitle || "";
  }

  const foundType = priority.find((type) => {
    if (titles[type]) {
      return titles[type];
    }
    return null;
  });
  return foundType ? titles[foundType] : objectTitle || "";
};

/**
 * Returns the synopsis from the titles object using a given order of priority. Defaults long to short.
 * @param synopsis the synopsis object
 * @param priority optional order of priority
 * @returns {string}
 */
export const getSynopsisByOrder = (
  synopsis: { [s in SynopsisTypes]: string } | undefined,
  priority: SynopsisTypes[] = ["long", "medium", "short"]
): string => {
  if (!synopsis) {
    return "";
  }

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

  let image = images.items.find((img) => img.type === type);

  if (!image) [image] = images.items;

  const urlWithoutExtension = image.url.replace(/\.[^/.]+$/, "");
  return size
    ? `${urlWithoutExtension}-${size}.jpg`
    : `${urlWithoutExtension}.jpg`;
};

/**
 * getImageSrcAndSizeByWindow - returns the image src with the size set to the window height or width, whichever is more
 * Skylark keeps aspect ratio itself, so send the largest value for both width and height
 * @param images {ImageUrls} - All images returned by Skylark
 * @param type {ImageTypes} - The image type to find and return
 * @returns {string} the image URL or an empty string, without size if window is undefined
 */
export const getImageSrcAndSizeByWindow = (
  images: UnexpandedObjects | ImageUrls | undefined,
  type: ImageTypes
): string => {
  const imageSize =
    typeof window !== "undefined" &&
    (window.innerHeight > window.innerWidth
      ? `${window.innerHeight}x${window.innerHeight}`
      : `${window.innerWidth}x${window.innerWidth}`);

  return getImageSrc(images, type, imageSize || "");
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
 * formatReleaseDate - formats the release date
 * @param date date string
 * @param format optional format for the date
 * @returns string, empty if the date is empty
 */
export const formatReleaseDate = (
  date?: string,
  format = "MMMM D, YYYY"
): string => (date ? dayjs(date).format(format) : "");

/**
 * formatYear - takes a date, returns the year
 * @param date date string
 * @returns string, empty if the date is empty
 */
export const formatYear = (date?: string) => formatReleaseDate(date, "YYYY");
