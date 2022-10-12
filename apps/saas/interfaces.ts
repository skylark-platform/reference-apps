import { Brand, Episode, Movie, Season, Set } from "./types/gql";

export type SingleObjectType<T> = T extends "Episode"
  ? Episode
  : T extends "Movie"
  ? Movie
  : T extends "Brand"
  ? Brand
  : T extends "Season"
  ? Season
  : T extends "Set"
  ? Set
  : never;
