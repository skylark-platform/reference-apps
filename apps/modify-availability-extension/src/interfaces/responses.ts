import {
  SkylarkGraphQLAvailabilityDimension,
  SkylarkGraphQLAvailabilityDimensionValue,
} from "./gql";

export type GQLSkylarkListAvailabilityDimensionValuesResponse = Record<
  string,
  {
    uid: string;
    values: {
      next_token: string;
      objects: SkylarkGraphQLAvailabilityDimensionValue[];
    };
  }
>;

export interface GQLSkylarkListAvailabilityDimensionsResponse {
  listDimensions: {
    next_token: string;
    objects: SkylarkGraphQLAvailabilityDimension[];
  };
}
