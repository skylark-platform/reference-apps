import { Brand, Episode, Movie, Season, Set } from "./gql";

export type Entertainment = Episode | Movie | Brand | Season | Set;

export type GQLError = {
  response: {
    errors: { errorType: string; message: string }[];
    status: number;
  };
};
