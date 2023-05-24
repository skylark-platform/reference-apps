import { useQuery } from "@tanstack/react-query";
import { Dimensions, hasProperty } from "@skylark-reference-apps/lib";
import {
  useDimensions,
  skylarkRequestWithDimensions,
} from "@skylark-reference-apps/react";
import { Metadata } from "../types/gql";
import { GQLError } from "../types";

interface UseObjectOpts {
  disabled?: boolean;
  useExternalId?: boolean;
}

const shouldUseExternalId = (lookupValue: string) =>
  lookupValue.startsWith("rec") ||
  lookupValue.startsWith("ingestor_set") ||
  lookupValue.startsWith("streamtv_");

const fetcher = <T extends Metadata>(
  query: string,
  uid: string,
  dimensions: Dimensions,
  opts: UseObjectOpts
) =>
  skylarkRequestWithDimensions<{ getObject: T }>(query, dimensions, {
    [opts.useExternalId ? "externalId" : "uid"]: uid,
    language: dimensions.language,
    customerType: dimensions.customerType,
    deviceType: dimensions.deviceType,
  }).then(({ getObject: data }): T => data);

export const useObject = <T extends Metadata>(
  query: string,
  uid: string,
  opts?: UseObjectOpts
) => {
  const { dimensions } = useDimensions();

  const useExternalId =
    opts && hasProperty(opts, "useExternalId")
      ? opts.useExternalId
      : shouldUseExternalId(uid);

  const { data, error, isLoading } = useQuery({
    queryKey: ["Search", query, uid, dimensions],
    queryFn: () =>
      fetcher<T>(query, uid, dimensions, { ...opts, useExternalId }),
    enabled: opts?.disabled,
  });

  return {
    data,
    isLoading: !uid || isLoading,
    isError: error as GQLError,
  };
};
