import { GraphQLClient, gql } from "graphql-request";
import useSWR from "swr";
import { GQLMultipleEntertainmentObjects } from "@skylark-reference-apps/lib";

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

const fetcher = (query: string) => {
  const endpoint =
    "https://qr6ydgprtjajhk4g6grz64i2yi.appsync-api.eu-west-1.amazonaws.com/graphql";

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      "x-api-key": "da2-eebyrzq45zctlhnbadz3yudiuq",
      "x-account-id": "2022-09-21T13:58:45.121Z",
    },
  });

  return graphQLClient
    .request<{ getSet: GQLMultipleEntertainmentObjects }>(query)
    .then((data) => data.getSet);
};

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
