import useSWR from "swr";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import {
  GraphQLMediaObjectTypes,
  graphQLClient,
} from "@skylark-reference-apps/lib";
import { Brand, Episode, Movie, Season } from "../types/gql";

type ObjectType<T> = T extends "Episode"
  ? Episode
  : T extends "Movie"
  ? Movie
  : T extends "Brand"
  ? Brand
  : T extends "Season"
  ? Season
  : never;

const createGraphQLQuery = (
  type: GraphQLMediaObjectTypes,
  lookupValue: string
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
    images: {
      objects: {
        title: true,
        image_type: true,
        image_url: true,
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
    fieldsToFetch.episode_number = true;
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
          ignore_availability: true,
        },
        ...fieldsToFetch,
      },
    },
  };

  const query = jsonToGraphQLQuery(queryAsJson);

  return { query, method };
};

const fetcher = <T extends GraphQLMediaObjectTypes>([type, lookupValue]: [
  type: T,
  lookupValue: string
]) => {
  const { query, method } = createGraphQLQuery(type, lookupValue);
  return graphQLClient
    .request<{ [key: string]: ObjectType<T> }>(query)
    .then(({ [method]: data }): ObjectType<T> => data);
};

export const useSingleObject = <T extends GraphQLMediaObjectTypes>(
  type: T,
  lookupValue: string
) => {
  const { data, error } = useSWR<ObjectType<T>, Error>(
    [type, lookupValue],
    fetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
