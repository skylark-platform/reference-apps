import { GraphQLMediaObjectTypes } from "@skylark-apps/skylarktv/src/lib/interfaces";

export type ValidMediaObjectRelationships =
  | "themes"
  | "genres"
  | "tags"
  | "credits"
  | "ratings"
  | "images"
  | "call_to_actions";

export type RelationshipsLink = { [key: string]: { link: string | string[] } };

export type SetRelationshipsLink = Omit<
  Record<
    GraphQLMediaObjectTypes | "SkylarkSet",
    { link: { position: number; uid: string }[] }
  >,
  "SkylarkAsset" | "SkylarkLiveAsset"
>;
