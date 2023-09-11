import { graphQLClient } from "@skylark-reference-apps/lib";
import { EnumType, jsonToGraphQLQuery } from "json-to-graphql-query";
import { chunk } from "lodash";
import { CREATE_OBJECT_CHUNK_SIZE } from "../../constants";

const OBJECT_CONFIG: Record<
  string,
  {
    colour: string;
    primaryField: string;
    fieldConfig: {
      name: string;
      ui_field_type: string | null;
      ui_position: number;
    }[];
  }
> = {
  // Object created in schema section of ingestor
  StreamtvConfig: {
    colour: "5B45CE",
    primaryField: "app_name",
    fieldConfig: [
      {
        name: "app_name",
        ui_field_type: "STRING",
        ui_position: 1,
      },
      {
        name: "primary_color",
        ui_field_type: "STRING",
        ui_position: 2,
      },
      {
        name: "accent_color",
        ui_field_type: "STRING",
        ui_position: 3,
      },
      {
        name: "featured_page_url",
        ui_field_type: null,
        ui_position: 4,
      },
      {
        name: "google_tag_manager_id",
        ui_field_type: "STRING",
        ui_position: 5,
      },
    ],
  },
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
              field_config: OBJECT_CONFIG[objectType].fieldConfig.map(
                (fieldConfig) => ({
                  ...fieldConfig,
                  ui_field_type: fieldConfig.ui_field_type
                    ? new EnumType(fieldConfig.ui_field_type)
                    : null,
                })
              ),
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
    mutations.map((mutation) => graphQLClient.uncachedRequest(mutation))
  );
};
