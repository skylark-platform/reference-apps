import { SkylarkGraphQLAvailabilityDimension, SkylarkGraphQLAvailabilityDimensionValue } from "./gql";
export interface ParsedSkylarkDimensionsWithValues extends SkylarkGraphQLAvailabilityDimension {
    values: SkylarkGraphQLAvailabilityDimensionValue[];
}
