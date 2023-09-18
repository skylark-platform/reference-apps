import { EnumType, jsonToGraphQLQuery } from "json-to-graphql-query";
import {
  graphQLClient,
  GraphQLObjectTypes,
  GraphQLSetObjectTypes,
} from "@skylark-reference-apps/lib";
import { FieldSet, Records } from "airtable";
import {
  SetConfig,
  GraphQLBaseObject,
  GraphQLMetadata,
  GraphQLIntrospectionProperties,
} from "../../interfaces";
import { RelationshipsLink, SetRelationshipsLink } from "../../types";
import { getValidPropertiesForObject, getExistingObjects } from "./get";
import {
  getValidFields,
  getGraphQLObjectAvailability,
  getLanguageCodesFromAirtable,
  hasProperty,
  createGraphQLOperation,
  convertGraphQLObjectTypeToArgName,
} from "./utils";
import { getMediaObjectRelationships, mutateMultipleObjects } from "./create";

interface SetItem {
  uid: string;
  position: number;
  graphqlObjectType: GraphQLObjectTypes;
}

const createSetContent = (
  contents: SetConfig["contents"],
  mediaObjects: GraphQLBaseObject[],
): SetRelationshipsLink => {
  const setItems = contents.map((content, index): SetItem => {
    const { slug } = content as { slug: string };
    const item = mediaObjects.find((object) => object.slug === slug);

    return {
      uid: item?.uid as string,
      position: index + 1,
      // eslint-disable-next-line no-underscore-dangle
      graphqlObjectType: item?.__typename as GraphQLObjectTypes,
    };
  });

  const content: SetRelationshipsLink = {
    Episode: { link: [] },
    Season: { link: [] },
    Brand: { link: [] },
    Movie: { link: [] },
    SkylarkSet: { link: [] },
    LiveStream: { link: [] },
  };

  for (let i = 0; i < setItems.length; i += 1) {
    const { graphqlObjectType, position, uid } = setItems[i];

    if (graphqlObjectType === "SkylarkAsset") {
      break;
    }

    if (!hasProperty(content, graphqlObjectType)) {
      throw new Error(
        `Object Type ${graphqlObjectType} is not a valid property. Valid ones are ${Object.keys(
          content,
        ).join(", ")}`,
      );
    }

    (
      content[graphqlObjectType] as {
        link: { position: number; uid: string }[];
      }
    ).link.push({ position, uid });
  }

  return content;
};

const createBasicSetArgs = (
  set: SetConfig,
  validProperties: GraphQLIntrospectionProperties[],
  content: SetRelationshipsLink,
  metadata: GraphQLMetadata,
  update: boolean,
) => {
  const availability = getGraphQLObjectAvailability(metadata.availability);

  const validFields = getValidFields(
    {
      slug: set.slug,
      type: set.graphQlSetType,
    },
    validProperties,
  );

  const args = update
    ? {
        external_id: set.externalId,
        skylark_set: {
          ...validFields,
          content,
          availability,
        },
      }
    : {
        skylark_set: {
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
  addRelationships: boolean,
) => {
  const { availability: availabilityField, ...fields } = airtableFields;

  const availability = getGraphQLObjectAvailability(
    metadata.availability,
    availabilityField as string[],
  );

  const relationships: RelationshipsLink = getMediaObjectRelationships(
    fields,
    metadata,
  );

  const validFields = getValidFields(
    {
      ...fields,
      slug: set.slug,
      type: set.graphQlSetType,
    },
    validProperties,
  );

  const args: {
    external_id?: string;
    language: string;
    skylark_set: {
      [key: string]: string | object | number | EnumType | boolean | null;
    };
  } = update
    ? {
        external_id: set.externalId,
        language,
        skylark_set: {
          ...validFields,
        },
      }
    : {
        language,
        skylark_set: {
          external_id: set.externalId,
          ...validFields,
        },
      };

  if (addRelationships) {
    args.skylark_set.content = content;
    args.skylark_set.availability = availability;
    args.skylark_set.relationships = relationships;
  }

  return args;
};

const createOrUpdateSet = async (
  method: string,
  args: object,
  mutationKey: string,
) => {
  const mutation = {
    mutation: {
      [mutationKey]: {
        __aliasFor: method,
        __args: args,
        __typename: true,
        uid: true,
        external_id: true,
        slug: true,
      },
    },
  };

  const graphQLMutation = jsonToGraphQLQuery(mutation);

  const data = await graphQLClient.uncachedRequest<{
    [key: string]: GraphQLBaseObject;
  }>(graphQLMutation);

  return data;
};

export const createOrUpdateGraphQLSet = async (
  set: SetConfig,
  mediaObjects: GraphQLBaseObject[],
  metadata: GraphQLMetadata,
  languagesTable: Records<FieldSet>,
  airtableSetsMetadata: Records<FieldSet>,
): Promise<GraphQLBaseObject | undefined> => {
  const validProperties = await getValidPropertiesForObject("SkylarkSet");

  const languageCodes = getLanguageCodesFromAirtable(languagesTable);

  const airtableTranslationsForThisSet = airtableSetsMetadata?.filter(
    ({ fields }) => fields.slug === set.slug,
  );
  const airtableTranslationLanguages = airtableTranslationsForThisSet
    .map(
      ({ fields }) =>
        fields.language && languageCodes[fields.language as string],
    )
    .filter((lang) => lang) as string[];

  const existingSets = new Set<string>();

  const existingSetsArr = await Promise.all([
    getExistingObjects("SkylarkSet", [{ externalId: set.externalId }]),
    ...airtableTranslationLanguages.map((language) =>
      getExistingObjects("SkylarkSet", [
        { externalId: set.externalId, language },
      ]),
    ),
  ]);

  existingSetsArr.forEach(({ existingExternalIds }) =>
    existingExternalIds.forEach((obj) => existingSets.add(obj)),
  );

  const setExists = existingSets.has(set.externalId);

  const operationName = setExists ? `updateSkylarkSet` : `createSkylarkSet`;

  const content = createSetContent(set.contents, mediaObjects);

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
        firstRequest,
      );

      // Always updateSkylarkSet after firstRequest to add more langauges
      const method = firstRequest ? operationName : "updateSkylarkSet";

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
    setExists,
  );
  const mutationKey = `${operationName}_${set.externalId}`;

  const data = await createOrUpdateSet(operationName, args, mutationKey);

  return data[mutationKey];
};

export const addContentToCreatedSets = async (
  setObjectType: GraphQLSetObjectTypes,
  setsWithContent: (GraphQLBaseObject & {
    content: {
      uid: string;
      position: number;
      objectType: GraphQLObjectTypes;
    }[];
  })[],
) => {
  const operations = setsWithContent.reduce(
    (previous, set) => {
      const content = set.content.reduce(
        (previousContent, { objectType, ...item }) => ({
          ...previousContent,
          [objectType]: {
            link: hasProperty(previousContent, objectType)
              ? [...previousContent[objectType as string].link, item]
              : [item],
          },
        }),
        {} as Record<string, { link: { uid: string; position: number }[] }>,
      );

      const argName = convertGraphQLObjectTypeToArgName(setObjectType);

      const args = {
        [argName]: {
          content,
        },
      };

      const { operation, method } = createGraphQLOperation(
        setObjectType,
        true,
        args,
        { external_id: set.external_id },
      );

      const key = `${method}_${set.external_id}`;

      const updatedOperations = {
        ...previous,
        [key]: {
          ...operation,
        },
      };
      return updatedOperations;
    },
    {} as Record<string, object>,
  );

  await mutateMultipleObjects<GraphQLBaseObject>(
    "addContentToSets",
    operations,
  );
};
