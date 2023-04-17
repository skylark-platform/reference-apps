import useSWR from "swr";
import { Dimensions } from "@skylark-reference-apps/lib";
import {
  useDimensions,
  skylarkRequestWithDimensions,
} from "@skylark-reference-apps/react";
import { Metadata } from "../types/gql";
import { GQLError } from "../types";

const fetcher = <T extends Metadata>([query, uid, dimensions]: [
  query: string,
  uid: string,
  dimensions: Dimensions
]) =>
  skylarkRequestWithDimensions<{ [key: string]: T }>(query, dimensions, {
    uid,
    language: dimensions.language,
    customerType: dimensions.customerType,
    deviceType: dimensions.deviceType,
  }).then(({ getObject: data }): T => data);

export const useObject = <T extends Metadata>(query: string, uid: string, disabled?: boolean) => {
  const { dimensions } = useDimensions();

  const { data, error, isLoading } = useSWR<T, GQLError>(
    disabled ? null : [query, uid, dimensions],
    fetcher
  );

  return {
    data,
    isLoading: !uid || !query || isLoading || (!error && !data),
    isError: error,
  };
};
