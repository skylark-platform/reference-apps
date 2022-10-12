import useSWRInfinite from "swr/infinite";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { Dimensions, graphQLClient } from "@skylark-reference-apps/lib";
import { useDimensions } from "@skylark-reference-apps/react";
import { Genre, GenreListing } from "../types/gql";
import { createGraphQLQueryDimensions } from "../lib/utils";

const createGraphQLQuery = (
  activeDimensions: Dimensions,
  nextToken?: string
) => {
  const method = `listGenre`;

  const { dimensions } = createGraphQLQueryDimensions(activeDimensions);

  const queryAsJson = {
    query: {
      __name: method,
      [method]: {
        __args: {
          next_token: nextToken || "",
          // No Portuguese Genres have been added to the ingestor yet
          dimensions,
        },
        next_token: true,
        objects: {
          uid: true,
          name: true,
        },
      },
    },
  };

  const query = jsonToGraphQLQuery(queryAsJson);

  return { query, method };
};

const fetcher = ([, dimensions, nextToken]: [
  name: string,
  dimensions: Dimensions,
  nextToken?: string
]) => {
  const { query, method } = createGraphQLQuery(dimensions, nextToken);
  return graphQLClient
    .request<{ [key: string]: GenreListing }>(query)
    .then(({ [method]: data }): GenreListing => data);
};

const getKey = (
  pageIndex: number,
  previousPageData: GenreListing | undefined,
  dimensions: Dimensions
) => {
  if (previousPageData && !previousPageData.next_token) return null;

  if (pageIndex === 0) return ["GenreListing", dimensions, ""];

  return ["GenreListing", dimensions, previousPageData?.next_token];
};

export const useGenreListing = () => {
  const { dimensions } = useDimensions();

  const { data, error, isLoading } = useSWRInfinite<GenreListing, Error>(
    (pageIndex: number, previousPageData: GenreListing | undefined) =>
      getKey(pageIndex, previousPageData, dimensions),
    fetcher,
    {
      initialSize: 3,
    }
  );

  const genres: Genre[] | undefined =
    data &&
    (data
      .flatMap((genreListing) => genreListing.objects)
      .filter((genre) => !!genre) as Genre[]);

  return {
    genres,
    isLoading: isLoading && !data,
    isError: error,
  };
};
