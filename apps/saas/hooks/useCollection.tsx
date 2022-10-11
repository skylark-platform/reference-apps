import useSWR from "swr";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { graphQLClient } from "@skylark-reference-apps/lib";
import { Set } from "../types/gql";

const createGraphQLQuery = (lookupValue: string) => {
  const method = `getSet`;

  // Helper to use the external_id when an airtable record ID is given
  const lookupField = lookupValue.startsWith("ingestor_set")
    ? "external_id"
    : "uid";

  const queryAsJson = {
    query: {
      __name: method,
      [method]: {
        __args: {
          ignore_availability: true,
          [lookupField]: lookupValue,
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

const getSetFetcher = ([lookupValue]: [lookupValue: string]) => {
  const { query, method } = createGraphQLQuery(lookupValue);
  return graphQLClient
    .request<{ [key: string]: Set }>(query)
    .then(({ [method]: data }): Set => data);
};

export const useCollection = (lookupValue: string) => {
  const { data, error, isLoading } = useSWR<Set, Error>(
    [lookupValue],
    getSetFetcher
  );

  return {
    collection: data,
    isLoading: isLoading && !data,
    isError: error,
  };
};
