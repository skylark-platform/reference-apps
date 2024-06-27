import { useQuery } from "@tanstack/react-query";
import { Dimensions, hasProperty } from "@skylark-reference-apps/lib";
import {
  useDimensions,
  skylarkRequestWithDimensions,
} from "@skylark-reference-apps/react";
import { Metadata } from "../types/gql";
import { GQLError } from "../types";
import { isSkylarkUid } from "../lib/utils";

interface UseObjectOpts<T extends Metadata> {
  disabled?: boolean;
  useExternalId?: boolean;
  initialData?: T;
}

const fetcher = <T extends Metadata>(
  query: string,
  uid: string,
  dimensions: Dimensions,
  opts: UseObjectOpts<T>,
) =>
  skylarkRequestWithDimensions<{ getObject: T }>(query, dimensions, {
    [opts.useExternalId ? "externalId" : "uid"]: uid,
  }).then(({ getObject: data }): T => data);

export const useObject = <T extends Metadata>(
  query: string,
  uid: string,
  opts?: UseObjectOpts<T>,
) => {
  const { dimensions, isLoadingDimensions } = useDimensions();

  const useExternalId =
    opts && hasProperty(opts, "useExternalId")
      ? opts.useExternalId
      : !isSkylarkUid(uid);

  const { data, error, isLoading } = useQuery({
    queryKey: ["Search", query, uid, dimensions],
    queryFn: () =>
      fetcher<T>(query, uid, dimensions, { ...opts, useExternalId }),
    enabled: Boolean(!opts?.disabled && !isLoadingDimensions && query),
    initialData: opts?.initialData,
  });

  return {
    data,
    isLoading: !uid || isLoading,
    isError: error as GQLError,
  };
};
