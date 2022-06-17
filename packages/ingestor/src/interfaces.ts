import {
  ApiEntertainmentObject,
  ApiImageType,
  ApiPerson,
  ApiRole,
  ApiSchedule,
  ApiSetType,
  SetTypes,
} from "@skylark-reference-apps/lib";
import { Record, FieldSet } from "airtable";

export type ApiObjectType =
  | "brands"
  | "seasons"
  | "episodes"
  | "movies"
  | "people"
  | "roles";

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
    metadata: FieldSet[];
  };
  airtableCredits: Record<FieldSet>[];
  roles: (ApiRole & { airtableId: string })[];
  people: (ApiPerson & { airtableId: string })[];
}
