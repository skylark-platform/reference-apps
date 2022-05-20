import {
  EntertainmentType,
  ObjectTypes,
  UnexpandedObject,
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

export const convertEntertainmentTypeToString = (type: EntertainmentType) => {
  switch (type) {
    case "movie":
      return "Movie";
    case "episode":
      return "Episode";
    case "season":
      return "Season";
    case "brand":
      return "Brand";
    case "asset":
      return "Asset";
    default:
      throw new Error("Unknown EntertainmentType");
  }
};

/**
 * Converts an ObjectType to a valid Skylark Endpoint
 * @param type The object type to convert
 * @returns string, the endpoint
 */
export const convertObjectTypeToSkylarkEndpoint = (
  type: ObjectTypes
): string => {
  switch (type) {
    case "episode":
      return "episodes";
    case "movie":
      return "movies";
    case "season":
      return "seasons";
    case "brand":
      return "brands";
    default:
      throw new Error("Unknown type provided");
  }
};

export const convertToUnexpandedObject = (
  arr: string[]
): UnexpandedObject[] => {
  const unexpandedImageUrls: UnexpandedObject[] = arr.map((item) => ({
    self: item,
    isExpanded: false,
  }));
  return unexpandedImageUrls;
};

/**
 * Determines the Skylark object type using the self URL
 * @param self the URL for the object
 * @returns {ObjectTypes}
 */
export const convertUrlToObjectType = (url: string): ObjectTypes => {
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
