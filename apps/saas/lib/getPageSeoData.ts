import {
  getTitleByOrder,
  getSynopsisByOrder,
  graphQLClient,
  GraphQLObjectTypes,
} from "@skylark-reference-apps/lib";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { Entertainment } from "../types/gql";

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
  lookupValue: string
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
          ignore_availability: true,
        },
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
      },
    },
  };

  const query = jsonToGraphQLQuery(queryAsJson);

  const { [method]: data } = await graphQLClient.request<{
    [key: string]: Entertainment;
  }>(query);

  const title = getTitleByOrder({
    short: data?.title_short || "",
    medium: data?.title_medium || "",
    long: data?.title_long || "",
  });

  const synopsis = getSynopsisByOrder({
    short: data?.synopsis_short || "",
    medium: data?.synopsis_medium || "",
    long: data?.synopsis_long || "",
  });

  const images =
    data.images?.objects?.map(
      (image): SeoObjectImage => ({ url: image?.image_url || "" })
    ) || [];

  return {
    title,
    synopsis,
    images,
  };
};
