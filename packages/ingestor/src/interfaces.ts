import {
  ApiBaseObject,
  ApiCredit,
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

export interface Airtables {
  brands: Record<FieldSet>[];
  seasons: Record<FieldSet>[];
  episodes: Record<FieldSet>[];
  movies: Record<FieldSet>[];
  roles: Record<FieldSet>[];
  people: Record<FieldSet>[];
  credits: Record<FieldSet>[];
  genres: Record<FieldSet>[];
  themes: Record<FieldSet>[];
  ratings: Record<FieldSet>[];
  setsMetadata: Record<FieldSet>[];
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
  | "computed-scheduled-items";

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
  ApiBaseObject & { title: string; name: string };
export interface SetConfig extends Partial<ApiEntertainmentObject> {
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

export interface Metadata {
  schedules: {
    always: ApiSchedule;
  };
  imageTypes: ApiImageType[];
  set: {
    types: ApiSetType[];
    additionalFields: FieldSet[];
  };
  airtableCredits: Record<FieldSet>[];
  roles: (ApiRole & { airtableId: string })[];
  people: (ApiPerson & { airtableId: string })[];
  genres: (ApiThemeGenre & { airtableId: string })[];
  themes: (ApiThemeGenre & { airtableId: string })[];
  ratings: (ApiRating & { airtableId: string })[];
}
