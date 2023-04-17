import { ApiEntertainmentObject, SetTypes } from "@skylark-reference-apps/lib";
import { ENUMS } from "../constants";
import { ApiObjectType } from "../types";

export interface SetConfig extends Partial<ApiEntertainmentObject> {
  externalId: string;
  title: string;
  slug: string;
  set_type_slug: SetTypes;
  graphQlSetType: typeof ENUMS.SET_TYPES[number];
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
