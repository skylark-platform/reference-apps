import {
  AllEntertainment,
  ApiCredit,
  ApiCredits,
  ApiImage,
  ApiImageUrls,
  Asset,
  Brand,
  CompleteApiEntertainmentObject,
  CompleteSetItem,
  Credit,
  Credits,
  Episode,
  ImageUrl,
  ImageUrls,
  Movie,
  ObjectTypes,
  Season,
  SkylarkObject,
  UnexpandedObject,
  UnexpandedSkylarkObject,
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
 * Combines multiple parameters into the format expected by the Skylark API
 * @param {fieldsToExpand, fields} - object containing query parameters to be parsed
 * @returns URL query
 */
export const createSkylarkApiQuery = ({
  fieldsToExpand,
  fields,
}: {
  fieldsToExpand: object;
  fields: object;
}) => {
  const parsedFieldsToExpand = convertObjectToSkylarkApiFields(fieldsToExpand);
  const parsedFields = convertObjectToSkylarkApiFields(fields);

  const query = [];

  if (parsedFieldsToExpand) {
    query.push(`fields_to_expand=${parsedFieldsToExpand}`);
  }

  if (parsedFields) {
    query.push(`fields=${parsedFields}`);
  }

  return query.join("&");
};

/**
 * Determines the Skylark object type using the self URL
 * @param self the URL for the object
 * @returns {ObjectTypes}
 */
export const getObjectTypeFromSelf = (self: string): ObjectTypes => {
  if (self.startsWith("/api/episode")) {
    return "episode";
  }

  if (self.startsWith("/api/movie")) {
    return "movie";
  }

  if (self.startsWith("/api/brand")) {
    return "brand";
  }

  if (self.startsWith("/api/season")) {
    return "season";
  }

  if (self.startsWith("/api/asset")) {
    return "asset";
  }

  return null;
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

const convertToUnexpandedObject = (arr: string[]): UnexpandedObject[] => {
  const unexpandedImageUrls: UnexpandedObject[] = arr.map((item) => ({
    self: item,
    isExpanded: false,
  }));
  return unexpandedImageUrls;
};

/**
 * Parses the image_urls object from the Skylark API
 * isExpanded depending on whether the object has been expanded
 * @param imageUrls the image_urls object from the Skylark API
 * @returns {ImageUrls}
 */
export const parseSkylarkImageUrls = (imageUrls: ApiImageUrls): ImageUrls => {
  if (typeof imageUrls[0] === "string" || imageUrls[0] instanceof String) {
    return convertToUnexpandedObject(imageUrls as string[]);
  }

  const parsedImageUrls: ImageUrl[] = (imageUrls as ApiImage[]).map(
    (item: ApiImage): ImageUrl => ({
      self: item.self,
      isExpanded: true,
      url: item.url,
      urlPath: item.url_path,
      type: item.image_type,
    })
  );

  return parsedImageUrls;
};

/**
 * Parses the credits object from the Skylark API
 * isExpanded depending on whether the object has been expanded
 * @param credits the credits object from the Skylark API
 * @returns {Credits}
 */
export const parseSkylarkCredits = (credits: ApiCredits): Credits => {
  if (typeof credits[0] === "string" || credits[0] instanceof String) {
    return convertToUnexpandedObject(credits as string[]);
  }

  const parsedImageUrls: Credit[] = (credits as ApiCredit[]).map(
    (item: ApiCredit): Credit => ({
      isExpanded: true,
      character: item.character,
      peopleUrl: {
        name: item.people_url.name,
      },
      roleUrl: {
        title: item.role_url.title,
      },
    })
  );

  return parsedImageUrls;
};

/**
 * Parses an object returned by the Skylark API
 * If the object contains child items, it will attempt to parse those too
 * @param obj
 * @returns a Skylark Object, preferably with a set ObjectType
 */
export const parseSkylarkObject = (
  obj: CompleteApiEntertainmentObject
): AllEntertainment => {
  let items: AllEntertainment[] = [];
  if (obj.items && obj.items.length > 0) {
    // If one item is a string, the items haven't been expanded
    if (typeof obj.items[0] === "string" || obj.items[0] instanceof String) {
      items = (obj.items as string[]).map(
        (self): UnexpandedSkylarkObject => ({
          isExpanded: false,
          self,
          type: getObjectTypeFromSelf(self),
        })
      );
    } else {
      const objectItems = obj.items as (
        | CompleteApiEntertainmentObject
        | CompleteSetItem
      )[];
      items = objectItems.map(
        (item): AllEntertainment => parseSkylarkObject(item.content_url || item)
      );
    }
  }

  const x: AllEntertainment = {
    self: obj.self || "",
    isExpanded: true,
    uid: obj.uid || "",
    slug: obj.slug || "",
    objectTitle: obj.title || "",
    title: {
      short: obj.title_short || "",
      medium: obj.title_medium || "",
      long: obj.title_long || "",
    },
    synopsis: {
      short: obj.synopsis_short || "",
      medium: obj.synopsis_medium || "",
      long: obj.synopsis_long || "",
    },
    items,
    type: null,
    images: obj.image_urls ? parseSkylarkImageUrls(obj.image_urls) : [],
    credits: obj.credits ? parseSkylarkCredits(obj.credits) : [],
    titleSort: obj.title_short || "",

    // TODO add these
    releaseDate: "",
    ratingUrls: [],
    tags: [],
    genreUrls: [],
    themeUrls: [],
  };

  if (obj.self) {
    if (obj.self.startsWith("/api/set") && obj.set_type_slug) {
      const set: SkylarkObject = {
        ...x,
        type: obj.set_type_slug,
      };
      return set;
    }

    if (obj.self.startsWith("/api/movie")) {
      const movie: Movie = {
        ...x,
        type: "movie",
        items: items as Asset[],
      };
      return movie;
    }

    if (obj.self.startsWith("/api/episode")) {
      const episode: Episode = {
        ...x,
        type: "episode",
        number: obj.episode_number || -1,
        items: items as Asset[],
      };
      return episode;
    }

    if (obj.self.startsWith("/api/season")) {
      const season: Season = {
        ...x,
        type: "season",
        number: obj.season_number || -1,
        releaseDate: `${obj.year || ""}`,
        numberOfEpisodes: obj.number_of_episodes || -1,
        items: items as (Episode | Asset)[],
      };
      return season;
    }

    if (obj.self.startsWith("/api/brand")) {
      const brand: Brand = {
        ...x,
        type: "brand",
        items: items as (Season | Movie | Episode | Asset)[],
      };
      return brand;
    }

    if (obj.self.startsWith("/api/asset")) {
      const asset: Asset = {
        ...x,
        type: "asset",
      };
      return asset;
    }
  }

  return x;
};
