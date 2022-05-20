import { ImageTypes, ImageUrl, ImageUrls } from "../interfaces/skylark/objects";

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
