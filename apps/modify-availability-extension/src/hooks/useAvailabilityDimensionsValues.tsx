import { useInfiniteQuery } from "@tanstack/react-query";
import { DocumentNode } from "graphql";
import { useMemo } from "react";

import { QueryKeys } from "../constants";
import { skylarkRequest } from "../lib/requestClient";
import {
  createGetAvailabilityDimensionValues,
  createGetAvailabilityDimensionValuesQueryAlias,
} from "../graphql/dynamicQueries";

import { useAvailabilityDimensions } from "./useAvailabilityDimensions";
import {
  GQLSkylarkListAvailabilityDimensionValuesResponse,
  ParsedSkylarkDimensionsWithValues,
  SkylarkGraphQLAvailabilityDimensionWithValues,
} from "../interfaces";

const getNextPageParam = (
  lastPage: GQLSkylarkListAvailabilityDimensionValuesResponse
): Record<string, string> | undefined => {
  const entries = Object.values(lastPage);

  const entriesWithNextToken = entries.filter(
    (entry) => !!entry.values.next_token
  );

  const nextTokens = entriesWithNextToken.reduce(
    (acc, { uid, values }) => ({
      ...acc,
      [uid]: values.next_token,
    }),
    {}
  );

  return entriesWithNextToken.length > 0 ? nextTokens : undefined;
};

const uri = "https://api.sl-f-sl-02.development.skylarkplatform.com/graphql";
const token = "skylark-admin-09MU31uYUeOAbKxebXWfbScWVNx98BBWE8J2Emx77k0";

export const useAvailabilityDimensionsWithValues = () => {
  const { dimensions: dimensionsWithoutValues } = useAvailabilityDimensions({
    uri,
    token,
  });

  const { data, fetchNextPage, hasNextPage, ...rest } =
    useInfiniteQuery<GQLSkylarkListAvailabilityDimensionValuesResponse>({
      queryKey: [QueryKeys.AvailabilityDimensions, dimensionsWithoutValues],
      queryFn: ({ pageParam: nextTokens }) => {
        const query = createGetAvailabilityDimensionValues(
          dimensionsWithoutValues,
          nextTokens
        );
        return skylarkRequest({
          uri,
          token,
          query: query as DocumentNode,
        });
      },
      getNextPageParam,
      enabled: !!dimensionsWithoutValues,
    });

  // This if statement ensures that all data is fetched
  if (hasNextPage) {
    void fetchNextPage();
  }

  const dimensionsWithValues = useMemo(():
    | ParsedSkylarkDimensionsWithValues[]
    | undefined => {
    if (!dimensionsWithoutValues) {
      return undefined;
    }

    if (data && !hasNextPage) {
      return dimensionsWithoutValues.map(
        (dimension): ParsedSkylarkDimensionsWithValues => {
          const dimensionValuePages = data.pages.map((page) => {
            const queryAlias = createGetAvailabilityDimensionValuesQueryAlias(
              dimension.uid
            );
            return (
              page[queryAlias] &&
              (page[
                queryAlias
              ] as SkylarkGraphQLAvailabilityDimensionWithValues)
            );
          });

          const flattenedValues = dimensionValuePages
            .flatMap((page) => (page ? page.values.objects : undefined))
            .filter(
              (item): item is SkylarkGraphQLAvailabilityDimensionWithValues =>
                !!item
            );

          return {
            ...dimension,
            values: flattenedValues,
          };
        }
      );
    }

    return dimensionsWithoutValues.map((dimension) => ({
      ...dimension,
      values: [],
    }));
  }, [data, dimensionsWithoutValues, hasNextPage]);

  return {
    dimensions: dimensionsWithValues,
    ...rest,
  };
};
