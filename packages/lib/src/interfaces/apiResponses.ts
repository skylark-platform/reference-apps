import { ObjectTypes, SetTypes } from "./media";

interface BaseApiEntertainment {
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
}

export interface CompleteSetItem {
  content_url: CompleteApiEntertainmentObject;
}

export interface CompleteApiEntertainmentObject extends BaseApiEntertainment {
  set_type_slug?: SetTypes;
  items?: string[] | (CompleteApiEntertainmentObject | CompleteSetItem)[];
  episode_number?: number;
  year?: number;
  season_number?: number;
  content_url: never;
  // content_url?: {
  //   items: CompleteApiEntertainmentObject[];
  // }
}

export interface ParsedEntertainmentObject
  extends CompleteApiEntertainmentObject {
  items: string[] | ParsedEntertainmentObject[];
  type: ObjectTypes;
}

export interface ApiImage {
  self: string;
  url: string;
  url_path: string;
  image_type: string;
}

export type ApiImageUrls = string[] | ApiImage[];

interface ApiAsset {
  self: string;
}

export interface ApiEpisode extends BaseApiEntertainment {
  episode_number?: number;
  items: ApiAsset[];
}

interface ApiSeasonWithEpisode extends BaseApiEntertainment {
  self: string;
  items: ApiEpisode[];
  year?: number;
  season_number: number;
}

interface ApiBrandWithSeasonsAndEpisodes extends BaseApiEntertainment {
  items: ApiSeasonWithEpisode[];
}
export interface ApiResponseBrandWithSeasonsAndEpisodes {
  objects: ApiBrandWithSeasonsAndEpisodes[];
}

export interface ApiSetItem {
  content_url: BaseApiEntertainment;
}

export interface ApiResponseHomePageSet {
  items: {
    content_url:
      | {
          set_type_slug: "slider" | "rail" | "collection";
          self: string;
          items: ApiSetItem[];
        }
      | {
          set_type_slug: never;
          self: string;
          items: (BaseApiEntertainment | ApiEpisode)[];
        };
  }[];
}
