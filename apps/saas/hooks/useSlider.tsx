import useSWR from "swr";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { graphQLClient, Dimensions } from "@skylark-reference-apps/lib";
import { useDimensions } from "@skylark-reference-apps/react";
import { Set } from "../types/gql";
import { createGraphQLQueryDimensions } from "../lib/utils";

const createGraphQLQuery = (lookupValue: string, dimensions: Dimensions) => {
  // Helper to use the external_id when an airtable record ID is given
  const lookupField = lookupValue.startsWith("rec") ? "external_id" : "uid";

  const fieldsToFetch: { [key: string]: boolean | object } = {
    __typename: true,
    uid: true,
    title: true,
    slug: true,
    title_short: true,
    title_medium: true,
    title_long: true,
    synopsis_short: true,
    synopsis_medium: true,
    synopsis_long: true,
    release_date: true,
    images: {
      objects: {
        title: true,
        type: true,
        url: true,
      },
    },
    content: {
      count: true,
      objects: {
        object: {
          __typename: true,
          slug: true,
          __on: [
            {
              __typeName: "Brand",
              uid: true,
              title_short: true,
              title_medium: true,
              images: {
                objects: {
                  title: true,
                  type: true,
                  url: true,
                },
              },
            },
            {
              __typeName: "Movie",
              uid: true,
              title_short: true,
              title_medium: true,
              images: {
                objects: {
                  title: true,
                  type: true,
                  url: true,
                },
              },
            },
          ],
        },
      },
    },
  };

  const method = "getSet";

  const queryAsJson = {
    query: {
      __name: method,
      [method]: {
        __args: {
          [lookupField]: lookupValue,
          ...createGraphQLQueryDimensions(dimensions),
        },
        ...fieldsToFetch,
      },
    },
  };

  const query = jsonToGraphQLQuery(queryAsJson);

  return { query, method };
};

const fetcher = ([lookupValue, dimensions]: [
  lookupValue: string,
  dimensions: Dimensions
]) => {
  const { query, method } = createGraphQLQuery(lookupValue, dimensions);
  return graphQLClient
    .request<{ [key: string]: Set }>(query)
    .then(({ [method]: data }) => data);
};

export const useSlider = (lookupValue: string) => {
  const { dimensions } = useDimensions();

  const { data, error } = useSWR<Set, Error>(
    [lookupValue, dimensions],
    fetcher
  );

  return {
    slider: data,
    isLoading: !error && !data,
    isError: error,
  };
};
