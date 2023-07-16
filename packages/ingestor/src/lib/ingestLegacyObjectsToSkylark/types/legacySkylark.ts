export enum LegacyObjectType {
  Brands = "brands",
  Seasons = "seasons",
  Episodes = "episodes",
  Assets = "assets",
  Tags = "tags",
  TagCategories = "tag-categories",
}

export enum LegacyObjectUidPrefix {
  Tag = "tag__",
  Asset = "asse_",
  Episode = "epis_",
  Season = "seas_",
}

interface LegacyTagRel {
  tag_url: string;
  schedule_urls: string[];
}

export interface LegacyCommonObject {
  _type: LegacyObjectType;
  all_languages: string[];
  data_source_fields: string[] | null;
  items: string[];
  modified_by: string;
  parent_url: string;
  self: string;
  uid: string;
  editability: string;
  created: string;
  data_source_id: string | null;
  last_data_ingest: string | null;
  modified: string;
  ends_on: string | null;
  is_data_source: boolean;
  publish_on: string;
  version_number: number;
  version_url: string;
  metadata_modified_by: string;
  metadata_modified: string;
  language_ends_on: null;
  language_is_data_source: boolean;
  language_modified_by: string;
  language_publish_on: string;
  language_version_number: number;
  language_version_url: string;
  language_modified: string;
  expired: boolean;
  future: boolean;
  schedule_urls: string[];
  hierarchy_url: string;
  metadata: object;
  schedule_statuses: {
    self: string;
    status: string;
  }[];
}

export interface LegacyResponseListObjectsData<T extends LegacyCommonObject> {
  objects: T[];
}

export interface LegacyBrand extends LegacyCommonObject {
  _type: LegacyObjectType.Brands;
  brand_type_url: null;
  image_urls: string[];
  plan_urls: string[];
  rating_urls: string[];
  recommended_content_urls: string[];
  eid: string;
  gender_skew: null;
  language: string;
  title: string;
  slug: string;
  name: string;
  synopsis: string;
  alternate_synopsis: string;
  extended_synopsis: string;
  recommendations: string;
  technique: string;
  why_choose_this: string;

  plans: [];

  sponsor_urls: string[];
  stats: null;
  tags: LegacyTagRel[];
  talent: [];
}

export interface LegacySeason extends LegacyCommonObject {
  _type: LegacyObjectType.Seasons;
  image_urls: string[];
  plan_urls: string[];
  rating_urls: string[];
  recommended_content_urls: string[];
  publish_on: string;
  season_number: number | null;
  number_of_episodes: number | null;
  year: null;
  eid: string;
  gender_skew: null;
  language: string;
  title: string;
  slug: string;
  name: string;
  synopsis: string;
  alternate_synopsis: string;
  extended_synopsis: string;
  recommendations: string;
  technique: string;
  why_choose_this: string;
  plans: string[];
  sponsor_urls: string[];
  stats: null;
  tags: LegacyTagRel[];
  talent: string[];
}

export interface LegacyEpisode extends LegacyCommonObject {
  _type: LegacyObjectType.Episodes;
  episode_type_url: null | string;
  image_urls: string[];
  plan_urls: string[];
  rating_urls: string[];
  recommended_content_urls: string[];
  episode_number: null;
  eid: string;
  credit_time: string;
  new_flag: string;
  gender_skew: null;
  title: string;
  slug: string;
  synopsis: string;
  subtitle: string;
  name: string;
  alternate_synopsis: string;
  extended_synopsis: string;
  recommendations: string;
  technique: string;
  why_choose_this: string;
  plans: string[];
  sponsor_urls: string[];
  stats: null;
  tags: LegacyTagRel[];
  talent: string[];
}

export interface LegacyAsset extends LegacyCommonObject {
  _type: LegacyObjectType.Assets;
  asset_type_url: {
    name: string;
  } | null;
  cc_urls: string[];
  image_urls: string[];
  ovps: string[];
  plan_urls: string[];
  product_urls: string[];
  rating_urls: string[];
  recommended_content_urls: string[];
  text_track_urls: string[];
  editability: string;
  stats_last_updated: null;
  duration: string;
  duration_in_seconds: number;
  max_devices: null;
  subtitles: false;
  sound: false;
  release_date: null;
  licensor: string;
  guidance: false;
  eid: string;
  entitlement: string;
  gender_skew: null;
  state: null;
  title: string;
  slug: string;
  guidance_text: string;
  url: string;
  name: string;
  state_reason: string;
  synopsis: string;
  alternate_synopsis: string;
  extended_synopsis: string;
  recommendations: string;
  technique: string;
  why_choose_this: string;
  expired: false;
  future: false;
  plans: string[];
  sponsor_urls: string[];
  stats: null;
  tags: LegacyTagRel[];
  talent: string[];
}

export interface LegacyTag extends LegacyCommonObject {
  _type: LegacyObjectType.Tags;
  category_url: "/api/tag-categories/cate_44ef19d0f44a4775af16bf7cf35f25b9/"; // this will be a relationship
  self: string;
  uid: string;
  uuid: null;
  slug: string;
  name: string;
}

export interface LegacyTagCategory extends LegacyCommonObject {
  _type: LegacyObjectType.TagCategories;
  self: string;
  uid: string;
  uuid: null;
  slug: string;
  name: string;
}

export type LegacyObjectsWithSynopsis =
  | LegacyEpisode
  | LegacyBrand
  | LegacySeason
  | LegacyAsset;

export type LegacyObjects =
  | LegacyTagCategory[]
  | LegacyTag[]
  | LegacyAsset[]
  | LegacyEpisode[]
  | LegacySeason[]
  | LegacyBrand[];
