import { GraphQLBaseObject } from "../../interfaces";

export type CreatedSkylarkObjectKeys =
  | "tagCategories"
  | "tags"
  | "assets"
  | "episodes"
  | "seasons"
  | "brands";

export type CreatedSkylarkObjects = Record<
  CreatedSkylarkObjectKeys,
  GraphQLBaseObject[]
>;
