import { SetTypes } from "./types";

export interface ApiImage {
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
  uid: string;
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
  image_urls?: ApiImage[];
  credits?: ApiCredit[];
  rating_urls?: ApiRatings;
  set_type_slug?: SetTypes;
  items?: string[] | (ApiEntertainmentObject | ApiSetObject)[];
  episode_number?: number;
  release_date?: string;
  season_number?: number;
  number_of_episodes?: number;
  title_sort?: string;
  content_url?: never;
  parent_url?: ApiEntertainmentObject | string;
}

export interface ApiSetObject {
  content_url: ApiEntertainmentObject;
}

export interface ApiMultipleEntertainmentObjects {
  objects: ApiEntertainmentObject[];
}

export interface ApiViewingsResponse {
  objects?: {
    mux: { tokenised_url: string };
  }[];
  error?: string;
}

export interface ApiPlaybackResponse {
  playback_url: string;
  error?: string;
}
