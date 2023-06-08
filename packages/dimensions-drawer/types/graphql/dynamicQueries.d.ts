import { SkylarkGraphQLAvailabilityDimension } from "../interfaces";
export declare const createGetAvailabilityDimensionValuesQueryAlias: (uid: string) => string;
export declare const createGetAvailabilityDimensionValues: (dimensions?: SkylarkGraphQLAvailabilityDimension[], nextTokens?: Record<string, string>) => import("graphql").DocumentNode | null;
