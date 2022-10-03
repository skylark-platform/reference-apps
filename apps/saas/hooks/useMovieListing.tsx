import useSWR from "swr";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { graphQLClient } from "@skylark-reference-apps/lib";
import { MovieListing } from "../types/gql";

const createGraphQLQuery = () => {
  const fieldsToFetch: { [key: string]: boolean | object } = {
    __typename: true,
    objects: {
      uid: true,
    },
  };

  const method = `listMovie`;

  const queryAsJson = {
    query: {
      __name: method,
      [method]: {
        __args: {
          ignore_availability: true,
        },
        ...fieldsToFetch,
      },
    },
  };

  const query = jsonToGraphQLQuery(queryAsJson);

  return { query, method };
};

const fetcher = () => {
  const { query, method } = createGraphQLQuery();
  return graphQLClient
    .request<{ [key: string]: MovieListing }>(query)
    .then(({ [method]: data }): MovieListing => data);
};

export const useMovieListing = () => {
  const { data, error } = useSWR<MovieListing, Error>(
    ["MovieListing"],
    fetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
