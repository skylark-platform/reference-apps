import useSWRInfinite from "swr/infinite";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { graphQLClient } from "@skylark-reference-apps/lib";
import { Genre, GenreListing } from "../types/gql";

const createGraphQLQuery = (nextToken?: string) => {
  const method = `listGenre`;

  const queryAsJson = {
    query: {
      __name: method,
      [method]: {
        __args: {
          ignore_availability: true,
          next_token: nextToken || "",
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

const fetcher = ([, nextToken]: [name: string, nextToken?: string]) => {
  const { query, method } = createGraphQLQuery(nextToken);
  return graphQLClient
    .request<{ [key: string]: GenreListing }>(query)
    .then(({ [method]: data }): GenreListing => data);
};

const getKey = (
  pageIndex: number,
  previousPageData: GenreListing | undefined
) => {
  if (previousPageData && !previousPageData.next_token) return null;

  if (pageIndex === 0) return ["GenreListing", ""];

  return ["GenreListing", previousPageData?.next_token];
};

export const useGenreListing = () => {
  const { data, error, isLoading } = useSWRInfinite<GenreListing, Error>(
    getKey,
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
