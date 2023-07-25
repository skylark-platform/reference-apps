import { GraphQLBaseObject } from "../../interfaces";

export type CreatedSkylarkObjectKeys =
  | "tagCategories"
  | "tags"
  | "assets"
  | "episodes"
  | "seasons"
  | "brands"
  | "people"
  | "genres"
  | "ratings"
  | "roles"
  | "images"
  | "credits"
  | "sets";

export type CreatedSkylarkObjects = Record<
  CreatedSkylarkObjectKeys,
  GraphQLBaseObject[]
>;

export type ConvertedLegacyObject = { external_id: string } & Record<
  string,
  string | null | string[] | boolean | number | object
>;
