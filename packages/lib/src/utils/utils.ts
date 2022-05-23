import {
  TitleTypes,
  ImageTypes,
  ImageUrl,
  ImageUrls,
  Credit,
  Credits,
  CreditTypes,
} from "../interfaces/skylark/objects";

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
 * getImageSrc - finds and returns the wanted type of image optionally with an added resize value
 * @param images {ImageUrls} - All images returned by Skylark
 * @param type {ImageTypes} - The image type to find and return
 * @param size {string} - Optional resize value in the form {height}x{width} e.g. (100x200)
 * @returns {string} the image URL or an empty string
 */
export const getImageSrc = (
  images: ImageUrls,
  type: ImageTypes,
  size?: string
): string => {
  const expandedImages = (images as ImageUrl[]).filter(
    ({ isExpanded }) => isExpanded
  );
  const image = expandedImages.find((img) => img.type === type);

  if (image) {
    const urlWithoutExtension = image.url.replace(/\.[^/.]+$/, "");
    return size
      ? `${urlWithoutExtension}-${size}.jpg`
      : `${urlWithoutExtension}.jpg`;
  }
  return "";
};

/**
 * getCreditsByType - finds and returns all the credits that match a given type
 * @param credits {Credits}
 * @param type {CreditTypes}
 * @returns {Credit[]} an array of Credit
 */
export const getCreditsByType = (
  credits: Credits | undefined,
  type: CreditTypes
): Credit[] => {
  if (!credits) {
    return [];
  }

  const expandedCredits = (credits as Credit[]).filter(
    ({ isExpanded }) => isExpanded
  );
  return expandedCredits.filter((credit) => credit.roleUrl?.title === type);
};
