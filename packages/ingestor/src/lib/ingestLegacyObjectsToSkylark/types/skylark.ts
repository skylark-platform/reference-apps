import { GraphQLBaseObject } from "../../interfaces";

export type CreatedSkylarkObjectKeys =
  | "availabilities"
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
  | "sets"
  | "games";

export type CreatedSkylarkObjects = Record<
  CreatedSkylarkObjectKeys,
  GraphQLBaseObject[]
>;

export type ConvertedLegacyObject = { external_id: string } & Record<
  string,
  string | null | string[] | boolean | number | object
>;
