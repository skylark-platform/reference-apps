import { ENUMS } from "../constants";

export interface SetConfig {
  externalId: string;
  title: string;
  slug: string;
  graphQlSetType: typeof ENUMS.SET_TYPES[number];
  contents: (
    | {
        type: string;
        slug: string;
      }
    | {
        type: "set";
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
  resource: string;
  query: string;
}
