import {
  UnexpandedObjects,
  ImageUrls,
  ImageTypes,
  Credits,
  CreditTypes,
  Credit,
} from "../interfaces";

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
  size?: string,
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
  type: CreditTypes,
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
