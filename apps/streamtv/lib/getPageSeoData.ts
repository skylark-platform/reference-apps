import {
  getTitleByOrder,
  getSynopsisByOrder,
  graphQLClient,
  GraphQLObjectTypes,
} from "@skylark-reference-apps/lib";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { Entertainment } from "../types";
import { createGraphQLQueryDimensions } from "./utils";

interface SeoObjectImage {
  url: string;
}

export interface SeoObjectData {
  title?: string;
  synopsis?: string;
  images?: SeoObjectImage[];
}

export const getSeoDataForObject = async (
  type: GraphQLObjectTypes,
  lookupValue: string,
  language: string,
): Promise<SeoObjectData> => {
  // Helper to use the external_id when an airtable record ID is given
  const lookupField = lookupValue.startsWith("rec") ? "external_id" : "uid";

  const method = `get${type}`;

  const queryAsJson = {
    query: {
      __name: "getSeoData",
      [method]: {
        __args: {
          [lookupField]: lookupValue,
          ...createGraphQLQueryDimensions({
            language,
            // TODO can we work out these before the client loads the page?
            customerType: "premium",
            deviceType: "pc",
            timeTravel: "",
            region: "europe",
          }),
        },
        uid: true,
        title: true,
        slug: true,
        title_short: true,
        synopsis: true,
        synopsis_short: true,
        images: {
          objects: {
            title: true,
            type: true,
            url: true,
          },
        },
      },
    },
  };

  const query = jsonToGraphQLQuery(queryAsJson);

  try {
    const { [method]: data } = await graphQLClient.request<{
      [key: string]: Entertainment;
    }>(query);

    const title = getTitleByOrder({
      title: data?.title || "",
      title_short: data?.title_short || "",
    });

    const synopsis = getSynopsisByOrder({
      synopsis: data?.synopsis_short || "",
      synopsis_short: data?.synopsis_short || "",
    });

    const images =
      data.images?.objects?.map(
        (image): SeoObjectImage => ({ url: image?.url || "" }),
      ) || [];

    return {
      title,
      synopsis,
      images,
    };
  } catch (err) {
    const error = err as {
      response?: { errors?: { errorType: string; message: string }[] };
    };
    if (error && error?.response?.errors?.[0].errorType === "NotFound") {
      return {
        title: "Not found",
        synopsis: error.response.errors?.[0].message,
        images: [],
      };
    }

    return {
      title: "",
      synopsis: "",
      images: [],
    };
  }
};
