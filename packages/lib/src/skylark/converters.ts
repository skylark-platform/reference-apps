import {
  EntertainmentType,
  UnexpandedObject,
  UnexpandedObjects,
  UnexpandedSkylarkObject,
  UnexpandedSkylarkObjects,
} from "../interfaces";

/**
 * Recusively parses an object and returns it in the Skylark API format
 * @param obj a JS object
 * @param prefix optional - the prefix, used in recursion
 * @returns formatted fields query
 */
export const convertObjectToSkylarkApiFields = (
  obj: object,
  prefix?: string
): string => {
  const keys = Object.entries(obj).map(
    ([key, value]: [key: string, value: object]) => {
      const keyWithPrefix = prefix ? `${prefix}__${key}` : key;
      if (value && Object.keys(value).length > 0) {
        return `${keyWithPrefix},${convertObjectToSkylarkApiFields(
          value,
          keyWithPrefix
        )}`;
      }
      return keyWithPrefix;
    }
  );

  return keys.join(",");
};

/**
 * Determines the Skylark object type using the self URL
 * @param self the URL for the object
 * @returns {ObjectTypes}
 */
export const convertUrlToObjectType = (
  url: string
): EntertainmentType | null => {
  if (!url) throw new Error("Unknown url provided");

  if (url.startsWith("/api/episode")) {
    return "episode";
  }

  if (url.startsWith("/api/movie")) {
    return "movie";
  }

  if (url.startsWith("/api/brand")) {
    return "brand";
  }

  if (url.startsWith("/api/season")) {
    return "season";
  }

  if (url.startsWith("/api/asset")) {
    return "asset";
  }

  return null;
};

/**
 * Converts an array of urls to UnexpandedObjects
 * @param urls
 * @returns
 */
export const convertToUnexpandedObjects = (
  urls: string[]
): UnexpandedObjects => {
  const items: UnexpandedObject[] = urls.map((url) => ({
    self: url,
  }));
  return {
    isExpanded: false,
    items,
  };
};

/**
 * Converts an array of urls to UnexpandedSkylarkObjects
 * @param urls
 * @returns
 */
export const convertToUnexpandedSkylarkObjects = (
  urls: string[]
): UnexpandedSkylarkObjects => {
  const objects: UnexpandedSkylarkObject[] = urls.map((url) => ({
    self: url,
    type: convertUrlToObjectType(url),
  }));

  return {
    isExpanded: false,
    objects,
  };
};
