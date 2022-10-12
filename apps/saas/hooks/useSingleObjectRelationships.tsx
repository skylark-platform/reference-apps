/**
 * In Skylark, the more levels of relationships you request, the longer the query will take.
 * This hook is used in "useSingleObject" to fetch any relationships to an object while
 * "useSingleObject" is focussed on getting only simple metadata, with no relationships.
 * The reason for this is to make the first request as fast as possible, and updating
 * the object with relationships after.
 */
import useSWR from "swr";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import {
  graphQLClient,
  Dimensions,
  GraphQLObjectTypes,
} from "@skylark-reference-apps/lib";
import { useDimensions } from "@skylark-reference-apps/react";
import { createGraphQLQueryDimensions } from "../lib/utils";
import { SingleObjectType } from "../interfaces";

const createGraphQLQuery = (
  type: GraphQLObjectTypes,
  lookupValue: string,
  dimensions: Dimensions
) => {
  // Helper to use the external_id when an airtable record ID is given
  const lookupField = lookupValue.startsWith("rec") ? "external_id" : "uid";

  const fieldsToFetch: { [key: string]: boolean | object } = {
    images: {
      objects: {
        title: true,
        type: true,
        url: true,
      },
    },
  };

  if (["Episode", "Movie"].includes(type)) {
    fieldsToFetch.credits = {
      objects: {
        character: true,
        people: {
          objects: {
            name: true,
          },
        },
        roles: {
          objects: {
            title: true,
          },
        },
      },
    };
    fieldsToFetch.themes = {
      objects: {
        name: true,
      },
    };
    fieldsToFetch.genres = {
      objects: {
        name: true,
      },
    };
    fieldsToFetch.ratings = {
      objects: {
        value: true,
      },
    };
  }

  if (type === "Episode") {
    fieldsToFetch.seasons = {
      objects: {
        season_number: true,
        brands: {
          objects: {
            title_short: true,
            title_medium: true,
            title_long: true,
          },
        },
      },
    };
  }

  if (type === "Movie") {
    fieldsToFetch.brands = {
      objects: {
        title_short: true,
        title_medium: true,
        title_long: true,
      },
    };
  }

  if (type === "Brand") {
    fieldsToFetch.tags = {
      objects: {
        name: true,
      },
    };
    fieldsToFetch.ratings = {
      objects: {
        value: true,
      },
    };
    fieldsToFetch.seasons = {
      objects: {
        title_short: true,
        title_medium: true,
        title_long: true,
        season_number: true,
        number_of_episodes: true,
        episodes: {
          objects: {
            uid: true,
            episode_number: true,
          },
        },
      },
    };
  }

  const method = `get${type}`;

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

const fetcher = <T extends GraphQLObjectTypes>([
  ,
  type,
  lookupValue,
  dimensions,
]: [key: string, type: T, lookupValue: string, dimensions: Dimensions]) => {
  const { query, method } = createGraphQLQuery(type, lookupValue, dimensions);
  return graphQLClient
    .request<{ [key: string]: SingleObjectType<T> }>(query)
    .then(({ [method]: data }): SingleObjectType<T> => data);
};

export const useSingleObjectRelationships = <T extends GraphQLObjectTypes>(
  type: T,
  lookupValue: string
) => {
  const { dimensions } = useDimensions();

  const { data, error } = useSWR<SingleObjectType<T>, Error>(
    [`${type}Relationships`, type, lookupValue, dimensions],
    fetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
