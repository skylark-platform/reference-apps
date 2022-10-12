import useSWR from "swr";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import {
  Dimensions,
  skylarkRequestWithDimensions,
  GraphQLObjectTypes,
} from "@skylark-reference-apps/lib";
import { useDimensions } from "@skylark-reference-apps/react";
import { Brand, Episode, Movie, Season, Set } from "../types/gql";
import { createGraphQLQueryDimensions } from "../lib/utils";
import { useSingleObjectRelationships } from "./useSingleObjectRelationships";

type ObjectType<T> = T extends "Episode"
  ? Episode
  : T extends "Movie"
  ? Movie
  : T extends "Brand"
  ? Brand
  : T extends "Season"
  ? Season
  : T extends "Set"
  ? Set
  : never;

const createGraphQLQuery = (
  type: GraphQLObjectTypes,
  lookupValue: string,
  dimensions: Dimensions
) => {
  // Helper to use the external_id when an airtable record ID is given
  const lookupField = lookupValue.startsWith("rec") ? "external_id" : "uid";

  const fieldsToFetch: { [key: string]: boolean | object } = {
    __typename: true,
    uid: true,
    title: true,
    slug: true,
    title_short: true,
    title_medium: true,
    title_long: true,
    synopsis_short: true,
    synopsis_medium: true,
    synopsis_long: true,
    release_date: true,
    images: {
      objects: {
        title: true,
        type: true,
        url: true,
      },
    },
  };

  if (type === "Episode") {
    fieldsToFetch.episode_number = true;
  }

  if (type === "Set") {
    fieldsToFetch.type = true;
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
  type,
  lookupValue,
  dimensions,
]: [type: T, lookupValue: string, dimensions: Dimensions]) => {
  const { query, method } = createGraphQLQuery(type, lookupValue, dimensions);
  return skylarkRequestWithDimensions<{ [key: string]: ObjectType<T> }>(
    query,
    dimensions
  ).then(({ [method]: data }): ObjectType<T> => data);
};

export const useSingleObject = <T extends GraphQLObjectTypes>(
  type: T,
  lookupValue: string
) => {
  const { dimensions } = useDimensions();

  const { data: basicMetadata, error } = useSWR<ObjectType<T>, Error>(
    [type, lookupValue, dimensions],
    fetcher
  );

  const { data: relationships, isError: relationshipsError } =
    useSingleObjectRelationships<T>(type, lookupValue);

  const data = {
    ...basicMetadata,
    ...relationships,
  } as ObjectType<T>;

  return {
    data,
    isLoading: !error && !basicMetadata,
    isNotFound: error?.message
      ? error.message.toLowerCase().includes("not found")
      : false,
    isError: error || relationshipsError,
  };
};
