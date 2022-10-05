import { ApiEntertainmentObject, SetTypes } from "@skylark-reference-apps/lib";
import { ApiObjectType } from "../types";

export interface SetConfig extends Partial<ApiEntertainmentObject> {
  dataSourceId: string; // V8
  externalId: string; // SaaS (GraphQL)
  title: string;
  slug: string;
  set_type_slug: SetTypes;
  graphQlSetType: "RAIL" | "COLLECTION" | "SLIDER" | "PAGE";
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
