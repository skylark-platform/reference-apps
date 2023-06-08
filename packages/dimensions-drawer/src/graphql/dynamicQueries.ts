import gql from "graphql-tag";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { hasProperty } from "../lib/utils";
import { SkylarkGraphQLAvailabilityDimension } from "../interfaces";

interface DimensionWithNextToken {
  dimension: SkylarkGraphQLAvailabilityDimension;
  nextToken: string;
}

export const createGetAvailabilityDimensionValuesQueryAlias = (uid: string) =>
  `dimension_${uid}`;

export const createGetAvailabilityDimensionValues = (
  dimensions?: SkylarkGraphQLAvailabilityDimension[],
  nextTokens?: Record<string, string>
) => {
  if (!dimensions) {
    return null;
  }

  console.log("createGetAvailabilityDimensionValues");

  const dimensionsWithNextTokens: DimensionWithNextToken[] = dimensions
    .map(
      (dimension) =>
        nextTokens &&
        nextTokens[dimension.uid] && {
          dimension,
          nextToken: nextTokens[dimension.uid],
        }
    )
    .filter(
      (item): item is DimensionWithNextToken => !!(item && item.nextToken)
    );

  const dimensionsToCreate =
    dimensionsWithNextTokens.length > 0
      ? dimensionsWithNextTokens
      : dimensions.map((dimension) => ({ dimension, nextToken: "" }));

  const query = {
    query: {
      __name: "LIST_AVAILABILITY_DIMENSION_VALUES",
      ...dimensionsToCreate.reduce((acc, { dimension, nextToken }) => {
        const queryAlias = createGetAvailabilityDimensionValuesQueryAlias(
          dimension.uid
        );
        return {
          ...acc,
          [queryAlias]: {
            __aliasFor: "getDimension",
            __args: {
              dimension_id: dimension.uid,
            },
            uid: true,
            values: {
              __args: {
                next_token: nextToken || null,
                limit: 50, // max
              },
              next_token: true,
              objects: {
                uid: true,
                title: true,
                external_id: true,
                slug: true,
                description: true,
              },
            },
          },
        };
      }, {}),
    },
  };

  const graphQLQuery = jsonToGraphQLQuery(query, { pretty: true });

  return gql(graphQLQuery);
};
