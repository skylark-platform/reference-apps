import {
  DimensionKey,
  Dimensions,
  getImageSrc,
  graphQLClient,
  ImageTypes,
  ImageUrls,
  LOCAL_STORAGE,
  skylarkRequest,
  UnexpandedObjects,
} from "@skylark-reference-apps/lib";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

/**
 * getImageSrcAndSizeByWindow - returns the image src with the size set to the window height or width, whichever is more
 * Skylark keeps aspect ratio itself, so send the largest value for both width and height
 * @param images {ImageUrls} - All images returned by Skylark
 * @param type {ImageTypes} - The image type to find and return
 * @returns {string} the image URL or an empty string, without size if window is undefined
 */
export const getImageSrcAndSizeByWindow = (
  images: UnexpandedObjects | ImageUrls | undefined,
  type: ImageTypes,
): string => {
  const imageSize =
    typeof window !== "undefined" &&
    (window.innerHeight > window.innerWidth
      ? `${window.innerHeight}x${window.innerHeight}`
      : `${window.innerWidth}x${window.innerWidth}`);

  return getImageSrc(images, type, imageSize || "");
};

export const skylarkRequestWithLocalStorage = <T>(
  query: string,
  headers: Record<string, string>,
  variables?: Record<string, unknown>,
) => {
  if (typeof window !== "undefined") {
    // Allow users to give their own Skylark to connect to
    const localStorageUri = window.localStorage.getItem(LOCAL_STORAGE.uri);
    const localStorageApiKey = window.localStorage.getItem(
      LOCAL_STORAGE.apikey,
    );
    if (localStorageUri && localStorageApiKey) {
      return skylarkRequest<T>(
        localStorageUri,
        localStorageApiKey,
        query,
        variables || {},
        headers,
      );
    }
  }

  return graphQLClient.request<T>(query, variables || {}, headers);
};

// Make request to Skylark using values from LocalStorage if found
export const skylarkRequestWithDimensions = <T>(
  query: string,
  dimensions: Dimensions,
  optVariables?: Record<string, unknown>,
) => {
  const headers: Record<string, string> = {
    "x-sl-dimension-customer-types": dimensions[DimensionKey.CustomerType],
    "x-sl-dimension-device-types": dimensions[DimensionKey.DeviceType],
    "x-sl-dimension-regions": dimensions[DimensionKey.Region],
    "x-language": dimensions[DimensionKey.Language],
  };

  if (dimensions[DimensionKey.TimeTravel]) {
    headers["x-time-travel"] = dimensions[DimensionKey.TimeTravel];
  }

  const variables = {
    ...optVariables,
  };

  return skylarkRequestWithLocalStorage<T>(query, headers, variables);
};

const persistQueryValue = (query: NextParsedUrlQuery, key: string) =>
  query[key] ? { [key]: query[key] } : {};

export const persistQueryValues = (query: NextParsedUrlQuery, keys: string[]) =>
  keys.reduce(
    (prev, key) => ({ ...prev, ...persistQueryValue(query, key) }),
    {} as NextParsedUrlQuery,
  );
