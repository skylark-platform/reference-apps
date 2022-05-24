import { ImageTypes, ImageUrl, ImageUrls } from "../interfaces/skylark/objects";

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
  if (!images.length) return "";

  const expandedImages = (images as ImageUrl[]).filter(
    ({ isExpanded }) => isExpanded
  );
  let image = expandedImages.find((img) => img.type === type);

  if (!image) [image] = expandedImages;

  const urlWithoutExtension = image.url.replace(/\.[^/.]+$/, "");
  return size
    ? `${urlWithoutExtension}-${size}.jpg`
    : `${urlWithoutExtension}.jpg`;
};
