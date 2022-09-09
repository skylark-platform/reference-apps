import {
  ApiAssetType,
  ApiBaseObject,
  ApiCredit,
  ApiDimension,
  ApiEntertainmentObject,
  ApiImageType,
  ApiPerson,
  ApiRating,
  ApiRole,
  ApiSchedule,
  ApiSetType,
  ApiThemeGenre,
  SetTypes,
} from "@skylark-reference-apps/lib";
import { Record, FieldSet } from "airtable";

export interface ApiEntertainmentObjectWithAirtableId
  extends ApiEntertainmentObject {
  airtableId: string;
}

export interface DimensionAirtables {
  affiliates: Record<FieldSet>[];
  customerTypes: Record<FieldSet>[];
  deviceTypes: Record<FieldSet>[];
  languages: Record<FieldSet>[];
  locales: Record<FieldSet>[];
  operatingSystems: Record<FieldSet>[];
  regions: Record<FieldSet>[];
  viewingContext: Record<FieldSet>[];
}

export interface TranslationAirtables {
  mediaObjects: Record<FieldSet>[];
}

export interface Airtables {
  dimensions: DimensionAirtables;
  translations: TranslationAirtables;
  mediaObjects: Record<FieldSet>[];
  roles: Record<FieldSet>[];
  people: Record<FieldSet>[];
  credits: Record<FieldSet>[];
  genres: Record<FieldSet>[];
  themes: Record<FieldSet>[];
  ratings: Record<FieldSet>[];
  images: Record<FieldSet>[];
  availibility: Record<FieldSet>[];
  setsMetadata: Record<FieldSet>[];
  assetTypes: Record<FieldSet>[];
  imageTypes: Record<FieldSet>[];
}

export type ApiObjectType =
  | "brands"
  | "seasons"
  | "episodes"
  | "movies"
  | "people"
  | "roles"
  | "images"
  | "genres"
  | "themes"
  | "ratings"
  | "computed-scheduled-items"
  | "assets";

export type ApiContentObjectType = "image-types" | "asset-types";

type AllApiObjects = Partial<
  ApiEntertainmentObject &
    ApiThemeGenre &
    ApiRole &
    ApiPerson &
    ApiRating &
    ApiCredit
>;
export type ApiSkylarkObjectWithAllPotentialFields = Omit<
  AllApiObjects,
  "slug"
> &
  ApiBaseObject & {
    title?: string;
    name?: string;
    data_source_fields?: string[];
    data_source_id: string;
  };
export interface SetConfig extends Partial<ApiEntertainmentObject> {
  dataSourceId: string;
  title: string;
  slug: string;
  set_type_slug: SetTypes;
  contents: (
    | {
        type: ApiObjectType;
        slug: string;
      }
    | {
        type: "set";
        set_type: SetTypes;
        slug: string;
      }
    | {
        type: "dynamic-object";
        name: string;
      }
  )[];
}

export interface DynamicObjectConfig {
  name: string;
  resource: ApiObjectType;
  query: string;
}

export interface ApiAirtableFields {
  airtableId: string;
}

export interface Metadata {
  schedules: {
    default: ApiSchedule;
    all: (ApiSchedule & ApiAirtableFields)[];
  };
  imageTypes: (ApiImageType & ApiAirtableFields)[];
  assetTypes: (ApiAssetType & ApiAirtableFields)[];
  set: {
    types: ApiSetType[];
    additionalRecords: { id: string; fields: FieldSet }[];
  };
  airtableCredits: Record<FieldSet>[];
  airtableImages: Record<FieldSet>[];
  roles: (ApiRole & ApiAirtableFields)[];
  people: (ApiPerson & ApiAirtableFields)[];
  genres: (ApiThemeGenre & ApiAirtableFields)[];
  themes: (ApiThemeGenre & ApiAirtableFields)[];
  ratings: (ApiRating & ApiAirtableFields)[];
  dimensions: {
    affiliates: (ApiDimension & ApiAirtableFields)[];
    deviceTypes: (ApiDimension & ApiAirtableFields)[];
    customerTypes: (ApiDimension & ApiAirtableFields)[];
    languages: (ApiDimension & ApiAirtableFields)[];
    locales: (ApiDimension & ApiAirtableFields)[];
    operatingSystems: (ApiDimension & ApiAirtableFields)[];
    regions: (ApiDimension & ApiAirtableFields)[];
    viewingContext: (ApiDimension & ApiAirtableFields)[];
  };
}
