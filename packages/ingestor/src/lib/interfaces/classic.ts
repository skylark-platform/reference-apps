import {
  ApiAssetType,
  ApiDimension,
  ApiEntertainmentObject,
  ApiImageType,
  ApiPerson,
  ApiRating,
  ApiRole,
  ApiSchedule,
  ApiSetType,
  ApiTag,
  ApiThemeGenre,
} from "@skylark-reference-apps/lib";
import { Record, FieldSet } from "airtable";

export interface ApiEntertainmentObjectWithAirtableId
  extends ApiEntertainmentObject {
  airtableId: string;
}

export interface ApiAirtableFields {
  airtableId: string;
}

export interface Metadata {
  schedules: {
    default?: ApiSchedule;
    always: ApiSchedule;
    all: (ApiSchedule & ApiAirtableFields)[];
  };
  imageTypes: (ApiImageType & ApiAirtableFields)[];
  assetTypes: (ApiAssetType & ApiAirtableFields)[];
  tagTypes: (ApiAssetType & ApiAirtableFields)[];
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
  tags: (ApiTag & ApiAirtableFields)[];
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
