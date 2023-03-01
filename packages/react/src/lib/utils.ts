import {
  Dimensions,
  getImageSrc,
  graphQLClient,
  ImageTypes,
  ImageUrls,
  LOCAL_STORAGE,
  skylarkRequest,
  UnexpandedObjects,
} from "@skylark-reference-apps/lib";

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

// Make request to Skylark using values from LocalStorage if found
export const skylarkRequestWithDimensions = <T>(
  query: string,
  dimensions: Dimensions
) => {
  const headers: { [key: string]: string } = {};

  if (dimensions.timeTravel) {
    headers["x-time-travel"] = dimensions.timeTravel;
  }

  if (typeof window !== "undefined") {
    // Allow users to give their own Skylark to connect to
    const localStorageUri = localStorage.getItem(LOCAL_STORAGE.uri);
    const localStorageApiKey = localStorage.getItem(LOCAL_STORAGE.apikey);
    if (localStorageUri && localStorageApiKey) {
      return skylarkRequest<T>(localStorageUri, localStorageApiKey, query);
    }
  }

  return graphQLClient.request<T>(query, {}, headers);
};
