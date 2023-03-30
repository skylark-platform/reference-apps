import { graphQLClient } from "@skylark-reference-apps/lib";
import { EnumType, jsonToGraphQLQuery } from "json-to-graphql-query";
import { chunk } from "lodash";
import { CREATE_OBJECT_CHUNK_SIZE } from "../../constants";

const OBJECT_CONFIG: Record<string, { colour: string; primaryField: string }> =
  {
    Episode: {
      colour: "FF7BA8",
      primaryField: "title",
    },
    Season: {
      colour: "9C27B0",
      primaryField: "title",
    },
    Brand: {
      colour: "673AB7",
      primaryField: "title",
    },
    ParentalGuidance: {
      colour: "03A9F4",
      primaryField: "slug",
    },
    Rating: {
      colour: "00BCD4",
      primaryField: "title",
    },
    Movie: {
      colour: "009688",
      primaryField: "title",
    },
    SkylarkTag: { colour: "4CAF50", primaryField: "name" },
    Genre: { colour: "8BC34A", primaryField: "name" },
    Theme: { colour: "CDDC39", primaryField: "name" },
    Role: { colour: "FFC107", primaryField: "title" },
    Person: { colour: "FF9800", primaryField: "name" },
    Credit: { colour: "FF5722", primaryField: "slug" },
    SkylarkAsset: { colour: "9E9E9E", primaryField: "title" },
    SkylarkImage: { colour: "607D8B", primaryField: "title" },
    SkylarkSet: { colour: "000000", primaryField: "title" },
  };

const createMutation = (): string[] => {
  const chunks = chunk(Object.keys(OBJECT_CONFIG), CREATE_OBJECT_CHUNK_SIZE);

  const mutations = chunks.map((objectConfigurations) => {
    const mutation = objectConfigurations.reduce((prev, objectType) => {
      const updatedOperations = {
        ...prev,
        [objectType]: {
          __aliasFor: "setObjectConfiguration",
          __args: {
            object: new EnumType(objectType),
            object_config: {
              colour: `#${OBJECT_CONFIG[objectType].colour.toLowerCase()}`,
              primary_field: OBJECT_CONFIG[objectType].primaryField,
            },
          },
          colour: true,
          primary_field: true,
        },
      };
      return updatedOperations;
    }, {} as { [key: string]: object });

    const parsedMutation = jsonToGraphQLQuery({ mutation });

    return parsedMutation;
  });

  return mutations;
};

export const updateObjectConfigurations = async () => {
  const mutations = createMutation();

  await Promise.all(
    mutations.map((mutation) => graphQLClient.request(mutation))
  );
};
