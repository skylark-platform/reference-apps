/*
import axios from "axios";
import useSWR from "swr";
import {
  SKYLARK_API,
  parseSkylarkObject,
  AllEntertainment,
  ApiMultipleEntertainmentObjects,
  createSkylarkRequestQueryAndHeaders,
  Dimensions,
} from "@skylark-reference-apps/lib";
import { useDimensions } from "@skylark-reference-apps/react";
import { useEffect, useState } from "react";
*/

import { GraphQLClient, gql } from "graphql-request";
import useSWR from "swr";

const queryG = gql`
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

// const homepageSwrKey = "homepage-set";
export const homepageSlug = "media-reference-homepage";

const fetcher = (query) => {
  console.log(query);
  const endpoint =
    "https://qr6ydgprtjajhk4g6grz64i2yi.appsync-api.eu-west-1.amazonaws.com/graphql";

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      "x-api-key": "da2-eebyrzq45zctlhnbadz3yudiuq",
      "x-account-id": "2022-09-21T13:58:45.121Z",
    },
  });

  return graphQLClient.request(queryG);
};

/*
export const homepageSetFetcher = ([, dimensions]: [
  key: string,
  dimensions: Dimensions
]) => {
  const { query, headers } = createSkylarkRequestQueryAndHeaders({
    fieldsToExpand,
    fields,
    dimensions,
  });

  return axios
    .get<ApiMultipleEntertainmentObjects>(
      `${SKYLARK_API}/api/sets/?slug=${homepageSlug}&set_type_slug=homepage&${query}`,
      { headers }
    )
    .then(({ data }) => {
      const {
        objects: [homepage],
      } = data;
      return parseSkylarkObject(homepage);
    });
};

*/

export const useHomepageSet = () => {
  const { data, error } = useSWR(queryG, fetcher);
  console.log("party data", data?.getSet?.content);
  return data;
  /*
  const [homepageData, setHomepageData] = useState<
    AllEntertainment | undefined
  >();
  const { dimensions } = useDimensions();

  const { data, error } = useSWR<AllEntertainment, Error>(
    [homepageSwrKey, dimensions],
    homepageSetFetcher
  );

  useEffect(() => {
    if (data) setHomepageData(data);
  }, [data]);

  return {
    homepage: data,
    isLoading: !error && !homepageData,
    isError: error,
  };

  */
};
