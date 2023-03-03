import useSWR from "swr";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { Dimensions } from "@skylark-reference-apps/lib";
import {
  useDimensions,
  skylarkRequestWithDimensions,
} from "@skylark-reference-apps/react";

import { Set } from "../types/gql";
import { createGraphQLQueryDimensions } from "../lib/utils";
import { GQLError } from "../types";

const createGraphQLQuery = (lookupValue: string, dimensions: Dimensions) => {
  const method = `getSet`;

  // Helper to use the external_id when an airtable record ID is given
  const lookupField =
    lookupValue.startsWith("ingestor_set") ||
    lookupValue.startsWith("streamtv_")
      ? "external_id"
      : "uid";

  const queryAsJson = {
    query: {
      __name: method,
      [method]: {
        __args: {
          ignore_availability: true,
          [lookupField]: lookupValue,
          ...createGraphQLQueryDimensions(dimensions),
        },
        uid: true,
        title: true,
        title_short: true,
        title_medium: true,
        title_long: true,
        synopsis_short: true,
        synopsis_medium: true,
        synopsis_long: true,
        release_date: true,
        ratings: {
          objects: {
            value: true,
          },
        },
        images: {
          objects: {
            title: true,
            type: true,
            url: true,
          },
        },
        content: {
          __args: {
            limit: 50,
          },
          next_token: true,
          objects: {
            object: {
              uid: true,
              slug: true,
              __typename: true,
            },
          },
        },
      },
    },
  };

  const query = jsonToGraphQLQuery(queryAsJson);

  return { query, method };
};

const getSetFetcher = ([lookupValue, dimensions]: [
  lookupValue: string,
  dimensions: Dimensions
]) => {
  const { query, method } = createGraphQLQuery(lookupValue, dimensions);
  return skylarkRequestWithDimensions<{ [key: string]: Set }>(
    query,
    dimensions
  ).then(({ [method]: data }): Set => data);
};

export const useCollection = (lookupValue: string) => {
  const { dimensions } = useDimensions();

  const { data, error, isLoading } = useSWR<Set, GQLError>(
    [lookupValue, dimensions],
    getSetFetcher
  );

  return {
    collection: data,
    isLoading: isLoading && !data,
    isError: error,
  };
};
