import { SetTypes } from "./types";

export interface ApiBaseObject {
  uid: string;
  self: string;
  slug: string;
}

export interface ApiImage {
  uid: string;
  self: string;
  url: string;
  url_path: string;
  image_type: string;
}

export type ApiImageUrls = string[] | ApiImage[];

export interface ApiCreditUnexpanded {
  people_url: string;
  role_url: string;
}

export interface ApiCredit {
  character: string;
  people_url: {
    name: string;
  };
  role_url: {
    title: string;
  };
}

export type ApiCredits = string[] | ApiCreditUnexpanded[] | ApiCredit[];

export interface ApiThemeGenre {
  name: string;
}

export type ApiThemesAndGenres = string[] | ApiThemeGenre[];

export interface ApiRating {
  title?: string;
  value?: string;
}

export type ApiRatings = string[] | ApiRating[];

export interface ApiEntertainmentObject extends ApiBaseObject {
  title: string;
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
  release_date?: string;
  season_number?: number;
  number_of_episodes?: number;
  title_sort?: string;
  content_url?: never;
  parent_url?: ApiEntertainmentObject | string;
  schedule_urls?: string[];
}

export interface ApiSetObject {
  content_url: ApiEntertainmentObject;
}

export interface ApiSetItem {
  uid: string;
  self: string;
  content_url: string;
  set_url: string;
  content_type: string;
  position: string;
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

export interface ApiSchedule extends ApiBaseObject {
  status: string;
  title: string;
}

export interface ApiImageType extends ApiBaseObject {
  name: string;
}

export interface ApiSetType extends ApiBaseObject {
  title: string;
}

export interface ApiPerson extends ApiBaseObject {
  name: string;
  alias?: string;
  schedule_urls?: string[];
}

export interface ApiRole extends ApiBaseObject {
  title: string;
  slug: never;
}

export interface ApiDynamicObject extends ApiBaseObject {
  slug: never;
  name: string;
  url: string;
  description: string;
}
