import { Brand, Episode, Movie, Season, SkylarkSet } from "./gql";

export type Entertainment = Episode | Movie | Brand | Season | SkylarkSet;

export type GQLError = {
  response: {
    errors?: { errorType: string; message: string }[];
    status?: number;
  };
};
