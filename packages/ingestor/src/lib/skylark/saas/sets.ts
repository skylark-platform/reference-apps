import { EnumType, jsonToGraphQLQuery } from "json-to-graphql-query";
import { graphQLClient } from "@skylark-reference-apps/lib";
import { FieldSet, Records } from "airtable";
import { has, toString } from "lodash";
import { SetConfig, GraphQLBaseObject, GraphQLMetadata } from "../../interfaces";
import { ApiObjectType, RelationshipsLink, SetRelationshipsLink } from "../../types";
import { getValidPropertiesForObject, getExistingObjects } from "./get";
import { gqlObjectMeta, getValidFields, getGraphQLObjectAvailability } from "./utils";
import { getMediaObjectRelationships } from "./create";

interface SetItem {
  uid: string;
  position: number;
  apiType: ApiObjectType | "set";
}

export const createOrUpdateGraphQLSet = async (
  set: SetConfig,
  mediaObjects: GraphQLBaseObject[],
  metadata: GraphQLMetadata,
  languagesTable: Records<FieldSet>,
  airtableSetsMetadata: { id: string; fields: FieldSet }[]
): Promise<GraphQLBaseObject | undefined> => {
  const languageCodes: { [key: string]: string } = {};
  languagesTable.filter(({ fields: languageFields }) => has(languageFields, "code") && toString(languageFields.code)).forEach(({ fields: languageFields, id }) => {
    languageCodes[id] = languageFields.code as string;
  });

  const validProperties = await getValidPropertiesForObject("Set");

  const setExists =
    (await getExistingObjects("Set", [set.externalId])).length > 0;
  if (setExists) {
    // eslint-disable-next-line no-console
    console.warn("Updating sets is not implemented");
    return {} as GraphQLBaseObject;
  }

  const operationName = setExists ? `updateSet` : `createSet`;

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

  const airtableMetadataTranslations = airtableSetsMetadata?.filter(({ fields }) => fields.slug === set.slug);

  if (airtableMetadataTranslations && airtableMetadataTranslations.length > 0) {
    const sets = [];

    // Creating sets with the same data_source_id in parallel does not work as we need to create the set first before adding additional translations
    // due to this, we create sets in a synchronous order
    for (let i = 0; i < airtableMetadataTranslations.length; i+=1) {
      const metadataTranslation = airtableMetadataTranslations[i];
      const { fields: { availability: availabilityField, ...fields } } = metadataTranslation;

      const availability = getGraphQLObjectAvailability(
        metadata.availability,
        availabilityField as string[]
      );

      const relationships: RelationshipsLink = getMediaObjectRelationships(
        fields,
        metadata
      );


      const validFields = getValidFields(
        {
          ...fields,
          title: set.title,
          slug: set.slug,
          type: set.graphQlSetType,
        },
        validProperties
      );

      // Always updateSet to add more langauges
      const method = i === 0 ? operationName : "updateSet";
      const language = languageCodes[fields.language as string];

      const args: { external_id?: string, language: string, set: { [key: string]: string | object | number | EnumType | boolean } } = method === "updateSet"
        ? {
            external_id: set.externalId,
            language,
            set: {
              ...validFields,
            },
          }
        : {
            language,
            set: {
              external_id: set.externalId,
              ...validFields,
            },
          };

      // Only add relationships to first operation
      if(i === 0) {
        args.set.content = content;
        args.set.availability = availability;
        args.set.relationships = relationships;
      }

      const mutationKey = `${method}_${language.replace("-", "_")}_${set.externalId}`;

      const mutation = {
        mutation: {
          [mutationKey]: {
            __aliasFor: method,
            __args: args,
            uid: true,
            external_id: true,
            slug: true,
          },
        },
      };

      const graphQLMutation = jsonToGraphQLQuery(mutation);

      // eslint-disable-next-line no-await-in-loop
      const data = await graphQLClient.request<{
        [key: string]: GraphQLBaseObject;
      }>(graphQLMutation);

      sets.push(data[mutationKey])
    }

    return sets[0];
  }

  // return data[operationName];
};
