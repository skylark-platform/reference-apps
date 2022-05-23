export type SetTypes = "slider" | "rail" | "collection";
export type EntertainmentType =
  | "movie"
  | "episode"
  | "season"
  | "brand"
  | "asset";
export type ObjectTypes = EntertainmentType | SetTypes | null;

export type ImageTypes = "Thumbnail" | "Main" | "Poster";

export type CreditTypes = "Actor" | "Director" | "Writer";

export type DeviceTypes = "smartphone" | "pc";

export type TitleTypes = "short" | "medium" | "long";

export type SynopsisTypes = TitleTypes;
export interface UnexpandedObject {
  self: string;
  isExpanded: false;
}

export interface UnexpandedSkylarkObject extends UnexpandedObject {
  type: ObjectTypes;
}

export interface ImageUrl {
  self: string;
  isExpanded: true;
  url: string;
  urlPath: string;
  type: string;
}

export type ImageUrls = UnexpandedObject[] | ImageUrl[];

export interface Credit {
  isExpanded: true;
  character: string;
  peopleUrl: {
    name?: string;
  };
  roleUrl: {
    title?: CreditTypes;
  };
}

export type Credits = UnexpandedObject[] | Credit[];

export interface ThemeGenre {
  isExpanded: true;
  name: string;
}

export type ThemesAndGenres = UnexpandedObject[] | ThemeGenre[];

export interface Rating {
  isExpanded: true;
  title: string;
  value: string;
}

export type Ratings = UnexpandedObject[] | Rating[];

export interface SkylarkObject {
  self: string;
  type: ObjectTypes;
  isExpanded: true;
  uid: string;
  objectTitle: string;
  slug: string;
  title: {
    [key in TitleTypes]: string;
  };
  synopsis: {
    [key in SynopsisTypes]: string;
  };
  tags: string[];
  titleSort: string;
  credits: Credits;
  ratings: Ratings;
  themes: ThemesAndGenres;
  genres: ThemesAndGenres;
  images: ImageUrls;
  items: AllEntertainment[];
  parent: AllEntertainment | null;
}

export interface Asset extends SkylarkObject {
  type: "asset";
}

export interface Movie extends SkylarkObject {
  type: "movie";
  items: (Asset | UnexpandedSkylarkObject)[];
}

export interface Episode extends SkylarkObject {
  type: "episode";
  number: number;
  items: (Asset | UnexpandedSkylarkObject)[];
}

export interface Season extends SkylarkObject {
  type: "season";
  numberOfEpisodes: number;
  number: number;
  year: number;
  items: (Episode | Asset | UnexpandedSkylarkObject)[];
}

export interface Brand extends SkylarkObject {
  type: "brand";
  items: (Movie | Episode | Season | Asset | UnexpandedSkylarkObject)[];
}

export interface Set extends SkylarkObject {
  type: SetTypes;
}

export type AllEntertainment =
  | SkylarkObject
  | UnexpandedSkylarkObject
  | Asset
  | Episode
  | Season
  | Movie
  | Brand
  | Set;
