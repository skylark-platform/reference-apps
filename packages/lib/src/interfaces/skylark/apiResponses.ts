import { SetTypes } from "./types";

export interface ApiImage {
  uid: string;
  self: string;
  url: string;
  url_path: string;
  image_type: string;
}

export type ApiImageUrls = string[] | ApiImage[];

export interface ApiCredit {
  character: string;
  people_url: {
    name: string;
  };
  role_url: {
    title: string;
  };
}

export type ApiCredits = string[] | ApiCredit[];

export interface ApiThemeGenre {
  name: string;
}

export type ApiThemesAndGenres = string[] | ApiThemeGenre[];

export interface ApiRating {
  title?: string;
  value?: string;
}

export type ApiRatings = string[] | ApiRating[];

export interface ApiEntertainmentObject {
  uid: string;
  self: string;
  title: string;
  slug: string;
  title_short?: string;
  title_medium?: string;
  title_long?: string;
  theme_urls?: ApiThemesAndGenres;
  genre_urls?: ApiThemesAndGenres;
  synopsis_short?: string;
  synopsis_medium?: string;
  synopsis_long?: string;
  image_urls?: ApiImage[] | string[];
  credits?: ApiCredit[];
  rating_urls?: ApiRatings;
  set_type_slug?: SetTypes;
  items?: string[] | (ApiEntertainmentObject | ApiSetObject)[];
  episode_number?: number;
  season_number?: number;
  number_of_episodes?: number;
  title_sort?: string;
  content_url?: never;
  parent_url?: ApiEntertainmentObject | string;
  schedule_urls?: string[];
  release_date?: string;
}

export interface ApiSetObject {
  content_url: ApiEntertainmentObject;
}

export interface ApiMultipleEntertainmentObjects {
  objects: ApiEntertainmentObject[];
}

export interface ApiSchedule {
  uid: string;
  self: string;
  status: string;
  slug: string;
  title: string;
}

export interface ApiImageType {
  uid: string;
  self: string;
  name: string;
  slug: string;
}

export interface ApiSetType {
  uid: string;
  self: string;
  title: string;
  slug: string;
}
