import {
  convertObjectToSkylarkApiFields,
  convertToUnexpandedObjects,
  convertToUnexpandedSkylarkObjects,
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
  ApiRating,
  ApiRatings,
  Rating,
  Ratings,
  ApiThemesAndGenres,
  ApiThemeGenre,
  ThemesAndGenres,
  ThemeGenre,
  CreditTypes,
  UnexpandedObjects,
  UnexpandedSkylarkObjects,
  ExpandedSkylarkObjects,
  UnexpandedParentObject,
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
  deviceTypes,
}: {
  fieldsToExpand: object;
  fields: object;
  deviceTypes?: string[];
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

  if (deviceTypes && deviceTypes.length > 0) {
    query.push(`device_types=${deviceTypes.join(",")}`);
  }

  return query.join("&");
};

/**
 * Parses the image_urls object from the Skylark API
 * isExpanded depending on whether the object has been expanded
 * @param imageUrls the image_urls object from the Skylark API
 * @returns {ImageUrls}
 */
export const parseSkylarkImageUrls = (
  imageUrls: ApiImageUrls
): ImageUrls | UnexpandedObjects => {
  if (determineIfExpanded(imageUrls)) {
    return convertToUnexpandedObjects(imageUrls as string[]);
  }

  const parsedImageUrls: ImageUrl[] = (imageUrls as ApiImage[]).map(
    (item: ApiImage): ImageUrl => ({
      self: item.self,
      url: item.url,
      urlPath: item.url_path,
      type: item.image_type,
    })
  );

  return {
    isExpanded: true,
    items: parsedImageUrls,
  };
};

/**
 * Parses the credits object from the Skylark API
 * isExpanded depending on whether the object has been expanded
 * @param credits the credits object from the Skylark API
 * @returns {Credits}
 */
export const parseSkylarkCredits = (
  credits: ApiCredits
): Credits | UnexpandedObjects => {
  if (determineIfExpanded(credits)) {
    return convertToUnexpandedObjects(credits as string[]);
  }

  const parsedCredits: Credit[] = (credits as ApiCredit[]).map(
    (item: ApiCredit): Credit => ({
      character: item.character,
      peopleUrl: {
        name: item.people_url.name,
      },
      roleUrl: {
        title: item.role_url.title as CreditTypes | undefined,
      },
    })
  );

  return {
    isExpanded: true,
    items: parsedCredits,
  };
};

/**
 * Parses the theme_urls and genre_urls object from the Skylark API
 * Handles both Themes and Genres as have the same structure
 * isExpanded depending on whether the object has been expanded
 * @param themes the themes or genres object from the Skylark API
 * @returns {Themes}
 */
export const parseSkylarkThemesAndGenres = (
  apiObj: ApiThemesAndGenres
): ThemesAndGenres | UnexpandedObjects => {
  if (determineIfExpanded(apiObj)) {
    return convertToUnexpandedObjects(apiObj as string[]);
  }

  const parsedItems: ThemeGenre[] = (apiObj as ApiThemeGenre[]).map(
    (item: ApiThemeGenre): ThemeGenre => ({
      name: item.name,
    })
  );

  return {
    isExpanded: true,
    items: parsedItems,
  };
};

/**
 * Parses the rating_urls object from the Skylark API
 * isExpanded depending on whether the object has been expanded
 * @param ratings the ratings object from the Skylark API
 * @returns {Ratings}
 */
export const parseSkylarkRatings = (
  ratings: ApiRatings
): Ratings | UnexpandedObjects => {
  if (determineIfExpanded(ratings)) {
    return convertToUnexpandedObjects(ratings as string[]);
  }

  const parsedRatings: Rating[] = (ratings as ApiRating[]).map(
    (item: ApiRating): Rating => ({
      value: item.value || "",
      title: item.title || "",
    })
  );

  return {
    isExpanded: true,
    items: parsedRatings,
  };
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
  let items: ExpandedSkylarkObjects | UnexpandedSkylarkObjects | undefined;
  if (obj.items && obj.items.length > 0) {
    // If one item is a string, the items haven't been expanded
    if (determineIfExpanded([obj])) {
      items = convertToUnexpandedSkylarkObjects(obj.items as string[]);
    } else {
      const objectItems = obj.items as (
        | ApiEntertainmentObject
        | ApiSetObject
      )[];
      items = {
        isExpanded: true,
        objects: objectItems.map(
          (item): AllEntertainment =>
            parseSkylarkObject(item.content_url || item)
        ),
      };
    }
  }

  let parent;
  if (obj.parent_url) {
    if (determineIfExpanded([obj.parent_url] as object[])) {
      const [unexpandedParentUrl] = convertToUnexpandedSkylarkObjects([
        obj.parent_url,
      ] as string[]).objects;
      const unexpandedParent: UnexpandedParentObject = {
        ...unexpandedParentUrl,
        isExpanded: false,
      };
      parent = unexpandedParent;
    } else {
      parent = parseSkylarkObject(obj.parent_url as ApiEntertainmentObject);
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
    parent,
    type: null,
    images: obj.image_urls ? parseSkylarkImageUrls(obj.image_urls) : undefined,
    credits: obj.credits ? parseSkylarkCredits(obj.credits) : undefined,
    themes: obj.theme_urls
      ? parseSkylarkThemesAndGenres(obj.theme_urls)
      : undefined,
    genres: obj.genre_urls
      ? parseSkylarkThemesAndGenres(obj.genre_urls)
      : undefined,
    ratings: obj.rating_urls ? parseSkylarkRatings(obj.rating_urls) : undefined,
    titleSort: obj.title_sort || "",
    releaseDate: obj.release_date || "",
    // TODO add these
    tags: [],
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
      };
      return movie;
    }

    if (obj.self.startsWith("/api/episode")) {
      const episode: Episode = {
        ...x,
        type: "episode",
        number: obj.episode_number || undefined,
      };
      return episode;
    }

    if (obj.self.startsWith("/api/season")) {
      const season: Season = {
        ...x,
        type: "season",
        number: obj.season_number || undefined,
        numberOfEpisodes: obj.number_of_episodes || undefined,
      };
      return season;
    }

    if (obj.self.startsWith("/api/brand")) {
      const brand: Brand = {
        ...x,
        type: "brand",
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
