import { gql } from "graphql-request";
import useSWR from "swr";
import {
  GQLMultipleEntertainmentObjects,
  graphQLClient,
} from "@skylark-reference-apps/lib";

const queryGQL = gql`
  query MyQuery {
    getSet(
      ignore_availability: true
      uid: "3b9c7d0b-d747-44d2-bcf7-d2d373863f5e"
    ) {
      uid
      external_id
      slug
      title
      content {
        objects {
          slug
          ... on Set {
            content {
              objects {
                slug
                ... on Movie {
                  title
                  slug
                }
                ... on Brand {
                  title
                  slug
                }
              }
            }
          }
          ... on Movie {
            title
            slug
          }
          ... on Season {
            title
            slug
          }
        }
      }
    }
  }
`;

export const fetcher = (query: string) =>
  graphQLClient
    .request<{ getSet: GQLMultipleEntertainmentObjects }>(query)
    .then((data) => data.getSet);

export const useHomepageSet = () => {
  const { data, error } = useSWR<GQLMultipleEntertainmentObjects, Error>(
    queryGQL,
    fetcher
  );

  return {
    homepage: data,
    isLoading: !error && !data,
    isError: error,
  };
};
