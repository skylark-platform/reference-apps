import {
  convertObjectToSkylarkApiFields,
  convertToUnexpandedObject,
  convertUrlToObjectType,
} from "./converters";
import {
  AllEntertainment,
  ApiCredit,
  ApiCredits,
  ApiImage,
  ApiImageUrls,
  Asset,
  Brand,
  ApiEntertainmentObject,
  ApiSetObject,
  Credit,
  Credits,
  Episode,
  ImageUrl,
  ImageUrls,
  Movie,
  Season,
  SkylarkObject,
  UnexpandedSkylarkObject,
} from "../interfaces";

/**
 * Determines if an API object has been expanded
 * In Skylark, if one item in the array hasn't been expanded then none of them will be
 * @param items Possible Skylark objects or strings
 * @returns boolean
 */
const determineIfExpanded = (items: string[] | object[]): boolean =>
  typeof items[0] === "string" || items[0] instanceof String;

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
 * Parses the image_urls object from the Skylark API
 * isExpanded depending on whether the object has been expanded
 * @param imageUrls the image_urls object from the Skylark API
 * @returns {ImageUrls}
 */
export const parseSkylarkImageUrls = (imageUrls: ApiImageUrls): ImageUrls => {
  if (determineIfExpanded(imageUrls)) {
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
  if (determineIfExpanded(credits)) {
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
  obj: ApiEntertainmentObject
): AllEntertainment => {
  let items: AllEntertainment[] = [];
  if (obj.items && obj.items.length > 0) {
    // If one item is a string, the items haven't been expanded
    if (determineIfExpanded([obj])) {
      items = (obj.items as string[]).map(
        (self): UnexpandedSkylarkObject => ({
          isExpanded: false,
          self,
          type: convertUrlToObjectType(self),
        })
      );
    } else {
      const objectItems = obj.items as (
        | ApiEntertainmentObject
        | ApiSetObject
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
    titleSort: obj.title_sort || "",

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
