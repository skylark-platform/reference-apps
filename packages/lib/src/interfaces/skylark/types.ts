export type SetTypes = "slider" | "rail" | "collection" | "page";
export type EntertainmentType =
  | "movie"
  | "episode"
  | "season"
  | "brand"
  | "asset";
export type MetadataType = "person";
export type ObjectTypes = EntertainmentType | SetTypes | MetadataType | null;

export type ImageTypes = "Thumbnail" | "Main" | "Poster";

export type CreditTypes =
  | "Actor"
  | "Director"
  | "Writer"
  | "Engineer"
  | "Presenter";

export type DeviceTypes = "smartphone" | "pc";

export type TitleTypes = "title" | "title_short";

export type SynopsisTypes = "synopsis" | "synopsis_short";

export type DimensionTypes = "customer-types" | "device-types";

export type GraphQLMediaObjectTypes =
  | "Brand"
  | "Season"
  | "Episode"
  | "Movie"
  | "SkylarkAsset";

// Usually customer instances
export type OptionalCustomGraphQLObjectTypes = "TagCategory";

export type GraphQLObjectTypes =
  | GraphQLMediaObjectTypes
  | OptionalCustomGraphQLObjectTypes
  | "Theme"
  | "Genre"
  | "Rating"
  | "Person"
  | "Role"
  | "SkylarkTag"
  | "Credit"
  | "SkylarkSet"
  | "Dimension"
  | "DimensionValue"
  | "Availability"
  | "SkylarkImage"
  | "CallToAction";
