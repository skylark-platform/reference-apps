import { SetTypes } from "./objects";

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

export interface ApiEntertainmentObject {
  uid: string;
  self: string;
  title: string;
  slug: string;
  title_short?: string;
  title_medium?: string;
  title_long?: string;
  synopsis_short?: string;
  synopsis_medium?: string;
  synopsis_long?: string;
  image_urls?: ApiImage[];
  credits?: ApiCredit[];
  set_type_slug?: SetTypes;
  items?: string[] | (ApiEntertainmentObject | ApiSetObject)[];
  episode_number?: number;
  year?: number;
  season_number?: number;
  number_of_episodes?: number;
  content_url: never;
}

export interface ApiSetObject {
  content_url: ApiEntertainmentObject;
}
