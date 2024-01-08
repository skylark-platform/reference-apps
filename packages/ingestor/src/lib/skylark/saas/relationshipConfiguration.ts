import { graphQLClient } from "@skylark-reference-apps/lib";
import { EnumType, jsonToGraphQLQuery } from "json-to-graphql-query";

const createMutation = (
  relationshipConfigurations: { objectType: string; relationship: string }[],
): string => {
  const mutation = relationshipConfigurations.reduce(
    (prev, { objectType, relationship }) => {
      const updatedOperations = {
        ...prev,
        [`${objectType}_${relationship}`]: {
          __aliasFor: "setRelationshipConfiguration",
          __args: {
            object: new EnumType(objectType),
            relationship_name: relationship,
            relationship_config: { inherit_availability: true },
          },
          default_sort_field: true,
          inherit_availability: true,
        },
      };
      return updatedOperations;
    },
    {} as { [key: string]: object },
  );

  const parsedMutation = jsonToGraphQLQuery({ mutation });

  return parsedMutation;
};

export const updateRelationshipConfigurations = async () => {
  const mutation = createMutation([
    { objectType: "Episode", relationship: "credits" },
    { objectType: "Season", relationship: "credits" },
    { objectType: "Brand", relationship: "credits" },
    { objectType: "Movie", relationship: "credits" },
    { objectType: "SkylarkAsset", relationship: "credits" },
    { objectType: "LiveStream", relationship: "credits" },
    { objectType: "SkylarkSet", relationship: "credits" },
    { objectType: "Episode", relationship: "tags" },
    { objectType: "Season", relationship: "tags" },
    { objectType: "Brand", relationship: "tags" },
    { objectType: "Movie", relationship: "tags" },
    { objectType: "SkylarkAsset", relationship: "tags" },
    { objectType: "SkylarkLiveAsset", relationship: "tags" },
    { objectType: "LiveStream", relationship: "tags" },
    { objectType: "SkylarkSet", relationship: "tags" },
    { objectType: "SkylarkEPGProgram", relationship: "tags" },
    { objectType: "SkylarkImage", relationship: "tags" },
    { objectType: "Credit", relationship: "roles" },
    { objectType: "Credit", relationship: "people" },
    { objectType: "Person", relationship: "images" },
    { objectType: "Episode", relationship: "seasons" },
    { objectType: "Season", relationship: "brands" },
  ]);

  await graphQLClient.uncachedRequest(mutation);
};
