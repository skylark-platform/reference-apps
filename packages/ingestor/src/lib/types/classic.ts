import {
  ApiEntertainmentObject,
  ApiThemeGenre,
  ApiRole,
  ApiPerson,
  ApiRating,
  ApiCredit,
  ApiTag,
  ApiBaseObject,
} from "@skylark-reference-apps/lib";

export type ApiObjectType =
  | "brands"
  | "seasons"
  | "episodes"
  | "movies"
  | "people"
  | "roles"
  | "images"
  | "genres"
  | "themes"
  | "ratings"
  | "computed-scheduled-items"
  | "assets"
  | "sets";

export type ApiContentObjectType =
  | "image-types"
  | "asset-types"
  | "tag-categories";

type AllApiObjects = Partial<
  ApiEntertainmentObject &
    ApiThemeGenre &
    ApiRole &
    ApiPerson &
    ApiRating &
    ApiCredit &
    ApiTag
>;
export type ApiSkylarkObjectWithAllPotentialFields = Omit<
  AllApiObjects,
  "slug"
> &
  ApiBaseObject & {
    title?: string;
    name?: string;
    data_source_fields?: string[];
    data_source_id: string;
  };
