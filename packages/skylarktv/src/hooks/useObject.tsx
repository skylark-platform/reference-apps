import { useQuery } from "@tanstack/react-query";
import { Metadata } from "../types/gql";
import {
  hasProperty,
  isSkylarkUid,
  skylarkRequestWithDimensions,
} from "../lib/utils";
import { useDimensions } from "../contexts";
import { Dimensions } from "../lib/interfaces";
import { GQLError } from "../types";

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

  const { data, error, isLoading } = useQuery<T, GQLError>({
    queryKey: ["Object", query, uid, dimensions],
    queryFn: () =>
      fetcher<T>(query, uid, dimensions, { ...opts, useExternalId }),
    enabled: Boolean(!opts?.disabled && !isLoadingDimensions && query),
    initialData: opts?.initialData,
  });

  return {
    data,
    isLoading: !uid || isLoading,
    isError: error,
  };
};
