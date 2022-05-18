export type SetTypes = "slider" | "rail" | "collection";
export type EntertainmentType =
  | "movie"
  | "episode"
  | "season"
  | "brand"
  | "asset";
export type ObjectTypes = EntertainmentType | SetTypes | null;

export interface ImageUrl {
  self: string;
  isExpanded: true;
  url: string;
  urlPath: string;
  type: string;
}

export interface UnexpandedImageUrl {
  self: string;
  isExpanded: false;
}

export type ImageUrls = UnexpandedImageUrl[] | ImageUrl[];

export interface SkylarkObject {
  self: string;
  type: ObjectTypes;
  isExpanded: true;
  uid?: string;
  objectTitle?: string;
  slug?: string;
  releaseDate?: string;
  title?: {
    short?: string;
    medium?: string;
    long?: string;
  };
  synopsis?: {
    short?: string;
    medium?: string;
    long?: string;
  };
  tags?: string[];
  titleSort?: string;
  creditUrls?: string[];
  ratingUrls?: string[];
  genreUrls?: string[];
  // imageUrls?: string[];
  themeUrls?: string[];
  images?: ImageUrls;
  items?: AllEntertainment[];

  // Include image property during development, in future use imageUrls
  image?: string;
}

export interface UnexpandedSkylarkObject {
  self: string;
  type: ObjectTypes;
  isExpanded: false;
}

export interface Asset extends SkylarkObject {
  type: "asset";
}

export interface Movie extends SkylarkObject {
  type: "movie";
  duration?: string;
}

export interface Episode extends SkylarkObject {
  type: "episode";
  number?: number;
  duration?: string;
  // items?: Asset[];
}

export interface Season extends SkylarkObject {
  type: "season";
  numberOfEpisodes?: number;
  number?: number;
  // items?: Episode[];
}

export interface Brand extends SkylarkObject {
  type: "brand";
  // items?: (Movie | Episode | Season)[];
}

export type AllEntertainment =
  | SkylarkObject
  | UnexpandedSkylarkObject
  | Asset
  | Episode
  | Season
  | Movie
  | Brand;

export const entertainmentTypeAsString = (type: EntertainmentType) => {
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
