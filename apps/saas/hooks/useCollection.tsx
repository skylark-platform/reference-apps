import useSWRInfinite from "swr/infinite";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { graphQLClient } from "@skylark-reference-apps/lib";
import { CurationMetadata, Set } from "../types/gql";

const createGraphQLQuery = (nextToken?: string) => {
  const method = `getSet`;

  const queryAsJson = {
    query: {
      __name: method,
      [method]: {
        __args: {
          ignore_availability: true,
          uid: "3d3d45f6-dc54-4cc7-be47-940efaa81dc1",
        },

        uid: true,
        title: true,
        content: {
          __args: {
            next_token: nextToken || "",
          },
          next_token: true,
          objects: {
            uid: true,
            slug: true,
          },
        },
      },
    },
  };

  const query = jsonToGraphQLQuery(queryAsJson);

  return { query, method };
};

const getSetFetcher = ([, nextToken]: [name: string, nextToken?: string]) => {
  const { query, method } = createGraphQLQuery(nextToken);
  return graphQLClient
    .request<{ [key: string]: Set }>(query)
    .then(({ [method]: data }): Set => data);
};

const getKey = (pageIndex: number, previousPageData: Set | null) => {
  if (previousPageData && !previousPageData?.content?.next_token) return null;

  if (pageIndex === 0) return ["Set", ""];

  return ["Set", previousPageData?.content?.next_token];
};

export const useCollection = (disable = false) => {
  const { data, error, isLoading } = useSWRInfinite<Set, Error>(
    (pageIndex, previousPageData: Set) =>
      disable ? null : getKey(pageIndex, previousPageData),
    getSetFetcher,
    {
      initialSize: 10,
    }
  );

  const items: CurationMetadata[] | undefined =
    data &&
    (data
      .flatMap((collectionSet) => collectionSet?.content?.objects)
      .filter((movie) => !!movie) as CurationMetadata[]);

  console.log("data retrieved", items);

  // TODO missing collection data
  return {
    items,
    isLoading: isLoading && !data,
    isError: error,
  };
};
