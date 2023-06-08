import { useInfiniteQuery } from "@tanstack/react-query";

import { QueryKeys } from "../constants";
import { skylarkRequest } from "../lib/requestClient";
import { LIST_AVAILABILITY_DIMENSIONS } from "../graphql";
import {
  GQLSkylarkListAvailabilityDimensionsResponse,
  SkylarkGraphQLAvailabilityDimension,
} from "../interfaces";

export const useAvailabilityDimensions = ({
  uri,
  token,
}: {
  uri: string;
  token: string;
}) => {
  const { data, fetchNextPage, hasNextPage, ...rest } =
    useInfiniteQuery<GQLSkylarkListAvailabilityDimensionsResponse>({
      queryKey: [
        QueryKeys.AvailabilityDimensions,
        LIST_AVAILABILITY_DIMENSIONS,
      ],
      queryFn: async ({ pageParam: nextToken }) =>
        skylarkRequest({
          uri,
          token,
          query: LIST_AVAILABILITY_DIMENSIONS,
          variables: {
            nextToken,
          },
        }),
      getNextPageParam: (lastPage): string | undefined => {
        return lastPage.listDimensions.next_token || undefined;
      },
    });

  console.log("useAvailabilityDimensions", { data });

  // This if statement ensures that all data is fetched
  // We could remove it and add a load more button
  if (hasNextPage) {
    void fetchNextPage();
  }

  const dimensions: SkylarkGraphQLAvailabilityDimension[] | undefined =
    !hasNextPage && data
      ? data.pages.flatMap((item) => item.listDimensions.objects)
      : undefined;

  return {
    dimensions,
    ...rest,
  };
};
