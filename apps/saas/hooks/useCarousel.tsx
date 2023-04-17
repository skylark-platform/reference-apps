import useSWR from "swr";
import { Dimensions } from "@skylark-reference-apps/lib";
import {
  useDimensions,
  skylarkRequestWithDimensions,
} from "@skylark-reference-apps/react";
import { Set } from "../types/gql";
import { GQLError } from "../types";
import { GET_SET_FOR_CAROUSEL } from "../graphql/queries";

const fetcher = ([uid, dimensions]: [
  uid: string,
  dimensions: Dimensions
]) =>
  skylarkRequestWithDimensions<{ getSkylarkSet: Set }>(GET_SET_FOR_CAROUSEL,dimensions, {
    uid,
    language: dimensions.language,
    customerType: dimensions.customerType,
    deviceType: dimensions.deviceType,
  }).then(({ getSkylarkSet: data }): Set => data);

export const useCarousel = (uid: string) => {
  const { dimensions } = useDimensions();

  const { data, error, isLoading } = useSWR<Set, GQLError>(
    [uid, dimensions],
    fetcher
  );

  return {
    data,
    isLoading: isLoading || (!error && !data),
    isError: error,
  };
};
