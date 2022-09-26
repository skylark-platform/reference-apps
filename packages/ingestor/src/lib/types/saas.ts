export type MediaObjectTypes =
  | "Brand"
  | "Season"
  | "Episode"
  | "Movie"
  | "Asset";

export type GraphQLObjectTypes =
  | MediaObjectTypes
  | "Theme"
  | "Genre"
  | "Rating"
  | "Person"
  | "Role"
  | "Tag"
  | "Credit"
  | "Set";

export type ValidMediaObjectRelationships =
  | "themes"
  | "genres"
  | "tags"
  | "credits"
  | "ratings";

export type RelationshipsLink = { [key: string]: { link: string | string[] } };

export type SetRelationshipsLink = Omit<
  Record<
    MediaObjectTypes | "Set",
    { link: { position: number; uid: string }[] }
  >,
  "Asset"
>;
