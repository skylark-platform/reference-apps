import { GraphQLMediaObjectTypes } from "@skylark-reference-apps/lib";

export type ValidMediaObjectRelationships =
  | "themes"
  | "genres"
  | "tags"
  | "credits"
  | "ratings"
  | "images";

export type RelationshipsLink = { [key: string]: { link: string | string[] } };

export type SetRelationshipsLink = Omit<
  Record<
    GraphQLMediaObjectTypes | "Set",
    { link: { position: number; uid: string }[] }
  >,
  "Asset"
>;
