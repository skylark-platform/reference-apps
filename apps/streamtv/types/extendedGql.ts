import { Brand, Episode, Movie, Season, SkylarkSet } from "./gql";

export type Entertainment = Episode | Movie | Brand | Season | SkylarkSet;

export type GQLError = {
  response: {
    errors?: { errorType: string; message: string }[];
    status?: number;
  };
};

export enum StreamTVSupportedSetType {
  // Built in
  Collection = "COLLECTION",
  Page = "PAGE",
  Rail = "RAIL",
  Slider = "SLIDER",
  // Additional, added by ingestor
  RailInset = "RAIL_INSET",
  RailMovie = "RAIL_MOVIE",
  RailPortrait = "RAIL_PORTRAIT",
  RailWithSynopsis = "RAIL_WITH_SYNOPSIS",
}

export enum StreamTVSupportCallToActionType {
  // Built in
  SignUp = "SIGN_UP",
  ComingSoon = "COMING_SOON",
  LinkToRelatedObject = "LINK_TO_RELATED_OBJECT",
  LinkToUrl = "LINK_TO_URL",
}
