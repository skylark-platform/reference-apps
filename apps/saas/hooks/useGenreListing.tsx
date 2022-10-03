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

const fetcher = (input: [name: string, nextToken?: string]) => {
  const { query, method } = createGraphQLQuery(input[1]);
  return graphQLClient
    .request<{ [key: string]: GenreListing }>(query)
    .then(({ [method]: data }): GenreListing => data);
};

const getKey = (
  pageIndex: number,
  previousPageData: GenreListing | undefined
) => {
  // reached the end
  if (previousPageData && !previousPageData.next_token) return null;

  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return ["GenreListing", ""];

  // add the cursor to the API endpoint
  return ["GenreListing", previousPageData?.next_token];
};

export const useGenreListing = () => {
  const { data, error } = useSWRInfinite<GenreListing, Error>(getKey, fetcher, {
    initialSize: 3,
  });

  const genres: Genre[] = data
    ?.flatMap((genreListing) => genreListing.objects)
    .filter((genre) => !!genre) as Genre[];

  console.log("genres", genres);

  return {
    genres,
    isLoading: !error && !data,
    isError: error,
  };
};
