import { EnumType, jsonToGraphQLQuery } from "json-to-graphql-query";
import { graphQLClient } from "@skylark-reference-apps/lib";
import { FieldSet, Records } from "airtable";
import {
  SetConfig,
  GraphQLBaseObject,
  GraphQLMetadata,
  GraphQLIntrospectionProperties,
} from "../../interfaces";
import {
  ApiObjectType,
  RelationshipsLink,
  SetRelationshipsLink,
} from "../../types";
import { getValidPropertiesForObject, getExistingObjects } from "./get";
import {
  gqlObjectMeta,
  getValidFields,
  getGraphQLObjectAvailability,
  getLanguageCodesFromAirtable,
} from "./utils";
import { getMediaObjectRelationships } from "./create";
import { logUpdatingSetsNotImplemented } from "../classic/logging";

interface SetItem {
  uid: string;
  position: number;
  apiType: ApiObjectType | "set";
}

const createSetContent = (
  contents: SetConfig["contents"],
  mediaObjects: GraphQLBaseObject[]
): SetRelationshipsLink => {
  const setItems = contents.map((content, index): SetItem => {
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

  return content;
};

const createBasicSetArgs = (
  set: SetConfig,
  validProperties: GraphQLIntrospectionProperties[],
  content: SetRelationshipsLink,
  metadata: GraphQLMetadata,
  update: boolean
) => {
  const availability = getGraphQLObjectAvailability(metadata.availability);

  const validFields = getValidFields(
    {
      title: set.title,
      slug: set.slug,
      type: set.graphQlSetType,
    },
    validProperties
  );

  const args = update
    ? {
        external_id: set.externalId,
        set: {
          ...validFields,
          content,
          availability,
        },
      }
    : {
        set: {
          ...validFields,
          external_id: set.externalId,
          content,
          availability,
        },
      };

  return args;
};

const createSetArgsWithTranslations = (
  set: SetConfig,
  airtableFields: FieldSet,
  validProperties: GraphQLIntrospectionProperties[],
  content: SetRelationshipsLink,
  metadata: GraphQLMetadata,
  language: string,
  update: boolean,
  addRelationships: boolean
) => {
  const { availability: availabilityField, ...fields } = airtableFields;

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

  const args: {
    external_id?: string;
    language: string;
    set: { [key: string]: string | object | number | EnumType | boolean };
  } = update
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

  if (addRelationships) {
    args.set.content = content;
    args.set.availability = availability;
    args.set.relationships = relationships;
  }

  return args;
};

const createOrUpdateSet = async (
  method: string,
  args: object,
  mutationKey: string
) => {
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

  const data = await graphQLClient.request<{
    [key: string]: GraphQLBaseObject;
  }>(graphQLMutation);

  return data;
};

export const createOrUpdateGraphQLSet = async (
  set: SetConfig,
  mediaObjects: GraphQLBaseObject[],
  metadata: GraphQLMetadata,
  languagesTable: Records<FieldSet>,
  airtableSetsMetadata: Records<FieldSet>
): Promise<GraphQLBaseObject | undefined> => {
  const validProperties = await getValidPropertiesForObject("Set");

  const setExists =
    (await getExistingObjects("Set", [set.externalId])).length > 0;
  if (setExists) {
    logUpdatingSetsNotImplemented();
    return {} as GraphQLBaseObject;
  }

  const operationName = setExists ? `updateSet` : `createSet`;

  const languageCodes = getLanguageCodesFromAirtable(languagesTable);

  const content = createSetContent(set.contents, mediaObjects);

  const airtableTranslationsForThisSet = airtableSetsMetadata?.filter(
    ({ fields }) => fields.slug === set.slug
  );

  if (
    airtableTranslationsForThisSet &&
    airtableTranslationsForThisSet.length > 0
  ) {
    const sets = [];

    // Creating sets with the same external_id in parallel does not work as we need to create the set first before adding additional translations
    // due to this, we create sets in a synchronous order
    for (let i = 0; i < airtableTranslationsForThisSet.length; i += 1) {
      const metadataTranslation = airtableTranslationsForThisSet[i];

      const language =
        languageCodes[metadataTranslation.fields.language as string];

      const updateObject = setExists || i > 0;
      // only add relationships to first operation / always use update after initial create
      const firstRequest = i === 0;

      const args = createSetArgsWithTranslations(
        set,
        metadataTranslation.fields,
        validProperties,
        content,
        metadata,
        language,
        updateObject,
        firstRequest
      );

      // Always updateSet after firstRequest to add more langauges
      const method = firstRequest ? operationName : "updateSet";

      const mutationKey = `${method}_${language.replace("-", "_")}_${
        set.externalId
      }`;

      // eslint-disable-next-line no-await-in-loop
      const data = await createOrUpdateSet(method, args, mutationKey);

      sets.push(data[mutationKey]);
    }

    return sets[0];
  }

  const args = createBasicSetArgs(
    set,
    validProperties,
    content,
    metadata,
    setExists
  );
  const mutationKey = `${operationName}_${set.externalId}`;

  const data = await createOrUpdateSet(operationName, args, mutationKey);

  return data[mutationKey];
};
