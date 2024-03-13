export type SetTypes = "slider" | "rail" | "collection" | "page";
export type EntertainmentType =
  | "movie"
  | "episode"
  | "season"
  | "brand"
  | "asset"
  | "live-stream";
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

export type TitleTypes = "title_long" | "title_medium" | "title_short";

export type SynopsisTypes =
  | "synopsis_long"
  | "synopsis_medium"
  | "synopsis_short";

export type DimensionTypes = "customer-types" | "device-types" | "regions";

export type GraphQLMediaObjectTypes =
  | "Brand"
  | "Season"
  | "Episode"
  | "Movie"
  | "SkylarkAsset"
  | "SkylarkLiveAsset"
  | "LiveStream";

// Usually customer instances
export type OptionalCustomGraphQLObjectTypes = "TagCategory";

export type GraphQLSetObjectTypes = "SkylarkSet";

export type GraphQLObjectTypes =
  | GraphQLMediaObjectTypes
  | OptionalCustomGraphQLObjectTypes
  | GraphQLSetObjectTypes
  | "Theme"
  | "Genre"
  | "Rating"
  | "Person"
  | "Role"
  | "SkylarkTag"
  | "Credit"
  | "Dimension"
  | "DimensionValue"
  | "Availability"
  | "SkylarkImage"
  | "CallToAction"
  | "SkylarkLiveStream"
  | "Game";
