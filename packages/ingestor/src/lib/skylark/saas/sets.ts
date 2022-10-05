import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { graphQLClient } from "@skylark-reference-apps/lib";

import { SetConfig, GraphQLBaseObject } from "../../interfaces";
import { ApiObjectType, SetRelationshipsLink } from "../../types";
import { getValidPropertiesForObject, getExistingObjects } from "./get";
import { gqlObjectMeta, getValidFields } from "./utils";

interface SetItem {
  uid: string;
  position: number;
  apiType: ApiObjectType | "set";
}

export const createOrUpdateGraphQLSet = async (
  set: SetConfig,
  mediaObjects: GraphQLBaseObject[]
): Promise<GraphQLBaseObject> => {
  const validProperties = await getValidPropertiesForObject("Set");
  const validFields = getValidFields(
    {
      title: set.title,
      slug: set.slug,
      // TODO Switch type to EnumType when its fixed
      // type: new EnumType(set.graphQlSetType),
      type: set.graphQlSetType,
    },
    validProperties
  );

  const setExists =
    (await getExistingObjects("Set", [set.externalId])).length > 0;
  if (setExists) {
    // eslint-disable-next-line no-console
    console.warn("Updating sets is not implemented");
    return {} as GraphQLBaseObject;
  }

  const method = setExists ? `updateSet` : `createSet`;

  const setItems = set.contents.map((content, index): SetItem => {
    const { slug } = content as { slug: string };
    const item = mediaObjects.find((object) => object.slug === slug);
    return {
      uid: item?.uid as string,
      position: index + 1,
      apiType: content.type as ApiObjectType | "set",
    };
  });

  const content: SetRelationshipsLink = {
    Episode: { link: [] },
    Season: { link: [] },
    Brand: { link: [] },
    Movie: { link: [] },
    Set: { link: [] },
  };

  for (let i = 0; i < setItems.length; i += 1) {
    const { apiType, position, uid } = setItems[i];

    const objectType =
      apiType === "set" ? "Set" : gqlObjectMeta(apiType).objectType;
    if (objectType === "Asset") {
      break;
    }
    content[objectType].link.push({ position, uid });
  }

  const operationName = "createSet";

  const mutation = {
    mutation: {
      [operationName]: {
        __aliasFor: method,
        __args: setExists
          ? {
              external_id: set.externalId,
              set: {
                content,
                ...validFields,
              },
            }
          : {
              set: {
                external_id: set.externalId,
                content,
                ...validFields,
              },
            },
        uid: true,
        external_id: true,
        slug: true,
      },
    },
  };

  const graphQLMutation = jsonToGraphQLQuery(mutation);

  const data = await graphQLClient.request<{
    createSet: GraphQLBaseObject;
  }>(graphQLMutation);

  return data[operationName];
};
