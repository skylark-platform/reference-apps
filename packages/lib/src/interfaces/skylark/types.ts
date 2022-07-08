export type SetTypes =
  | "slider"
  | "rail"
  | "collection"
  | "homepage"
  | "generic";
export type EntertainmentType =
  | "movie"
  | "episode"
  | "season"
  | "brand"
  | "asset";
export type ObjectTypes = EntertainmentType | SetTypes | null;

export type ImageTypes = "Thumbnail" | "Main" | "Poster";

export type CreditTypes = "Actor" | "Director" | "Writer";

export type DeviceTypes = "smartphone" | "pc";

export type TitleTypes = "short" | "medium" | "long";

export type SynopsisTypes = TitleTypes;

export type DimensionTypes =
  | "affiliates"
  | "customer-types"
  | "device-types"
  | "locales"
  | "languages"
  | "operating-systems"
  | "regions"
  | "viewing-context";
