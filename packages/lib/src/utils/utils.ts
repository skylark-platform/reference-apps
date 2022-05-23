import {
  ImageTypes,
  ImageUrl,
  ImageUrls,
  Credit,
  Credits,
  CreditTypes,
} from "../interfaces/skylark/objects";

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
  credits: Credits,
  type: CreditTypes
): Credit[] => {
  const expandedCredits = (credits as Credit[]).filter(
    ({ isExpanded }) => isExpanded
  );
  return expandedCredits.filter((credit) => credit.roleUrl?.title === type);
};
