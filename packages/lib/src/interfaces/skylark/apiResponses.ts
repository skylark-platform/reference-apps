import { SetTypes } from "./types";

export interface ApiBaseObject {
  uid: string;
  self: string;
  slug: string;
  is_data_source?: boolean;
  data_source_id?: string;
  data_source_fields?: string[];
  schedule_urls?: string[];
}

export interface ApiImage extends ApiBaseObject {
  title: string;
  slug: never;
  url: string;
  url_path: string;
  image_type: string;
  image_type_url: string;
  image_location: string;
  content_url: string;
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

export interface ApiThemeGenre extends ApiBaseObject {
  name: string;
}

export type ApiThemesAndGenres = string[] | ApiThemeGenre[];

export interface ApiRating extends ApiBaseObject {
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
  credits?: ApiCredit[] | ApiCreditUnexpanded[];
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
  title: string;
  rights: boolean;
  affiliate_urls: string[];
  device_type_urls: string[];
  language_urls: string[];
  locale_urls: string[];
  region_urls: string[];
  customer_type_urls: string[];
  operating_system_urls: string[];
  viewing_context_urls: string[];
  status: string;
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

export interface ApiDimension extends ApiBaseObject {
  name: string;
}
