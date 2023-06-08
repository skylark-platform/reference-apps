export interface SkylarkGraphQLAvailabilityDimensionValue {
  uid: string;
  external_id: string;
  slug: string;
  title: string | null;
  description: string | null;
}

export interface SkylarkGraphQLAvailabilityDimension {
  uid: string;
  external_id: string;
  slug: string;
  title: string | null;
  description: string | null;
}

export interface SkylarkGraphQLAvailabilityDimensionWithValues
  extends SkylarkGraphQLAvailabilityDimension {
  values: {
    next_token: string;
    objects: SkylarkGraphQLAvailabilityDimensionValue[];
  };
}
