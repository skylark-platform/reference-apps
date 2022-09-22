import { FieldSet, Records } from "airtable";
import { GraphQLClient, gql } from "graphql-request";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { flatten, has, isArray, isNull, isString, values } from "lodash";
import {
  ApiObjectType,
  GraphQLBaseObject,
  GraphQLMetadata,
  SetConfig,
} from "../../../interfaces";

type MediaObjectTypes = "Brand" | "Season" | "Episode" | "Movie" | "Asset";
type ObjectTypes =
  | MediaObjectTypes
  | "Theme"
  | "Genre"
  | "Rating"
  | "Person"
  | "Role"
  | "Tag"
  | "Credit"
  | "Set";

type RelationshipsLink = { [key: string]: { link: string | string[] } };
type SetRelationshipsLink = Omit<
  Record<
    MediaObjectTypes | "Set",
    { link: { position: number; uid: string }[] }
  >,
  "Asset"
>;

const endpoint =
  "https://snjp62qr4fbvzfpf6xwlnpit54.appsync-api.eu-west-1.amazonaws.com/graphql";

const account = new Date().toISOString();
// const account = "test13"

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "x-api-key": "da2-ql6uljkn4vabjblyq4ty2sijhu",
    "x-account-id": account,
  },
});

const gqlObjectMeta = (
  type: ApiObjectType | MediaObjectTypes
): {
  createFunc: string;
  updateFunc: string;
  objectType: MediaObjectTypes;
  argName: "brand" | "season" | "episode" | "movie" | "asset";
  relName: "brands" | "seasons" | "episodes" | "movies" | "assets";
} => {
  switch (type) {
    case "episodes":
    case "Episode":
      return {
        createFunc: "createEpisode",
        updateFunc: "updateEpisode",
        objectType: "Episode",
        argName: "episode",
        relName: "episodes",
      };
    case "seasons":
    case "Season":
      return {
        createFunc: "createSeason",
        updateFunc: "updateSeason",
        objectType: "Season",
        argName: "season",
        relName: "seasons",
      };
    case "movies":
    case "Movie":
      return {
        createFunc: "createMovie",
        updateFunc: "updateMovie",
        objectType: "Movie",
        argName: "movie",
        relName: "movies",
      };
    case "assets":
    case "Asset":
      return {
        createFunc: "createAsset",
        updateFunc: "updateAsset",
        objectType: "Asset",
        argName: "asset",
        relName: "assets",
      };
    default:
      return {
        createFunc: "createBrand",
        updateFunc: "updateBrand",
        objectType: "Brand",
        argName: "brand",
        relName: "brands",
      };
  }
};

const getExtId = (externalId: string) =>
  externalId.substring(externalId.indexOf("#") + 1);

const getValidFields = (
  fields: FieldSet,
  validProperties: string[]
): { [key: string]: string | number | boolean } => {
  const validObjectFields = validProperties.filter((property) =>
    has(fields, property)
  );
  const validFields = validObjectFields.reduce((obj, property) => {
    const val = isArray(fields[property])
      ? (fields[property] as string[])[0]
      : fields[property];
    return {
      ...obj,
      [property]: val as string | number | boolean,
    };
  }, {} as { [key: string]: string | number | boolean });

  return validFields;
};

const getExistingObjects = async (
  objectType: ObjectTypes,
  externalIds: string[]
): Promise<string[]> => {
  const getOperations = externalIds.reduce((previousOperations, externalId) => {
    const operation = {
      ...previousOperations,
      [externalId]: {
        __aliasFor: `get${objectType}`,
        __args: {
          ignore_availability: true,
          external_id: externalId,
        },
        uid: true,
        external_id: true,
      },
    };
    return operation;
  }, {} as { [key: string]: object });

  const query = {
    query: {
      __name: `get${objectType}s`,
      ...getOperations,
    },
  };

  const graphQLGetQuery = jsonToGraphQLQuery(query, { pretty: true });

  try {
    // This request will error if at least one external_id doesn't exist
    await graphQLClient.request<{ [key: string]: GraphQLBaseObject }>(
      graphQLGetQuery
    );
  } catch (err) {
    if (err && has(err, "response.data")) {
      const {
        response: { data },
      } = err as { response: { data: { [recordId: string]: null | object } } };

      const notFoundObjectExternalIds = externalIds.filter((externalId) =>
        Object.keys(data)
          .filter((recordId) => isNull(data[recordId]))
          .includes(externalId)
      );
      const objectsThatExist = externalIds.filter(
        (externalId) => !notFoundObjectExternalIds.includes(externalId)
      );
      return objectsThatExist;
    }

    // If unexpected error, re throw
    throw err;
  }

  return externalIds;
};

const createOrUpdateMultipleObjects = async (
  mutation: string
): Promise<GraphQLBaseObject[]> => {
  const data = await graphQLClient.request<{
    [key: string]: GraphQLBaseObject;
  }>(mutation);

  console.log(JSON.stringify(data, undefined, 2));

  const arr = values(data);

  console.log(arr);

  return arr;
};

const getValidPropertiesForObject = async (objectType: ObjectTypes) => {
  const query = gql`
query Introspection {
  __type(name: "${objectType}") {
    name
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}
`;
  interface IIntrospectionType {
    __type: {
      name: string;
      fields: {
        name: string;
        type: {
          name: string;
          kind: string;
        };
      }[];
    };
  }

  const data = await graphQLClient.request<IIntrospectionType>(query);

  console.log(data);

  // eslint-disable-next-line no-underscore-dangle
  const types = data.__type.fields
    .filter(
      ({ type: { name, kind } }) =>
        kind !== "OBJECT" || (name && name.startsWith("String"))
    )
    .map(({ name }) => name);

  return types;
};

const getUidsFromField = (
  field: string[] | null,
  skylarkData: GraphQLBaseObject[]
) => {
  if (!field || field.length === 0) {
    return null;
  }

  const urls = skylarkData
    .filter(({ external_id }) => field.includes(getExtId(external_id)))
    .map(({ uid }) => uid);
  return urls;
};

export const createGraphQLMediaObjects = async (
  airtableRecords: Records<FieldSet>,
  metadata: GraphQLMetadata
) => {
  const validObjectProperties: { [key in MediaObjectTypes]: string[] } = {
    Episode: await getValidPropertiesForObject("Episode"),
    Season: await getValidPropertiesForObject("Season"),
    Brand: await getValidPropertiesForObject("Brand"),
    Movie: await getValidPropertiesForObject("Movie"),
    Asset: await getValidPropertiesForObject("Asset"),
  };

  const externalIds = airtableRecords.map(({ id }) => id);
  const existingObjects = flatten(
    await Promise.all(
      ["Brand", "Season", "Episode", "Movie", "Asset"].map((objectType) =>
        getExistingObjects(objectType as MediaObjectTypes, externalIds)
      )
    )
  );

  const createdMediaObjects: GraphQLBaseObject[] = [];
  while (createdMediaObjects.length < airtableRecords.length) {
    const objectsToCreateUpdate = airtableRecords.filter((record) => {
      // Filter out any records that have already been created
      const alreadyCreated = createdMediaObjects.find(
        ({ external_id }) => record.id === getExtId(external_id)
      );
      if (alreadyCreated) {
        return false;
      }

      // If the record doesn't have a parent, we can create it without dependencies on other objects
      if (!record.fields.parent) {
        return true;
      }

      // If the record has a parent, we need to ensure that its parent object has been created first
      const found = createdMediaObjects.find(({ external_id }) =>
        (record.fields.parent as string[]).includes(getExtId(external_id))
      );
      return found;
    });

    // Stops infinite loop
    if (objectsToCreateUpdate.length === 0) {
      break;
    }

    const operations = objectsToCreateUpdate.reduce(
      (previousOperations, { id, fields }) => {
        if (
          !has(fields, "title") ||
          !has(fields, "slug") ||
          !isString(fields.title) ||
          !isString(fields.slug)
        ) {
          return {};
        }

        const { objectType, argName, createFunc, updateFunc } = gqlObjectMeta(
          fields.skylark_object_type as ApiObjectType
        );

        const objectExists = existingObjects.includes(id);
        const method = objectExists ? updateFunc : createFunc;

        const validFields = getValidFields(
          fields,
          validObjectProperties[objectType]
        );

        const relationships: RelationshipsLink = {};

        const parentField = fields.parent as string[];
        if (parentField && parentField.length > 0) {
          const parent = createdMediaObjects.find(
            ({ external_id }) => parentField[0] === getExtId(external_id)
          );

          if (parent) {
            const { relName } = gqlObjectMeta(
              // eslint-disable-next-line no-underscore-dangle
              parent?.__typename as MediaObjectTypes
            );
            relationships[relName] = { link: parent.uid };
          }
        }

        const themeUids = getUidsFromField(
          fields.themes as string[],
          metadata.themes
        );
        if (themeUids && themeUids.length > 0) {
          relationships.themes = { link: themeUids };
        }

        const genreUids = getUidsFromField(
          fields.genres as string[],
          metadata.genres
        );
        if (genreUids && genreUids.length > 0) {
          relationships.genres = { link: genreUids };
        }

        const ratingUids = getUidsFromField(
          fields.ratings as string[],
          metadata.ratings
        );
        if (ratingUids && ratingUids.length > 0) {
          relationships.ratings = { link: ratingUids };
        }

        const tagUids = getUidsFromField(
          fields.tags as string[],
          metadata.tags
        );
        if (tagUids && tagUids.length > 0) {
          relationships.tags = { link: tagUids };
        }

        const creditUids = getUidsFromField(
          fields.credits as string[],
          metadata.credits
        );
        if (creditUids && creditUids.length > 0) {
          relationships.credits = { link: creditUids };
        }

        const updatedOperations: { [key: string]: object } = {
          ...previousOperations,
          [`${method}_${id}`]: {
            __aliasFor: method,
            __args: objectExists
              ? {
                  external_id: id,
                  [argName]: {
                    ...validFields,
                    relationships,
                  },
                }
              : {
                  [argName]: {
                    external_id: id,
                    ...validFields,
                    relationships,
                  },
                },
            __typename: true,
            uid: true,
            external_id: true,
            title: true,
            slug: true,
          },
        };
        return updatedOperations;
      },
      {} as { [key: string]: object }
    );

    const mutation = {
      mutation: {
        __name: "createMediaObjects",
        ...operations,
      },
    };

    console.log("mutation", mutation);

    const graphQLMutation = jsonToGraphQLQuery(mutation, { pretty: true });

    // eslint-disable-next-line no-await-in-loop
    const arr = await createOrUpdateMultipleObjects(graphQLMutation);
    createdMediaObjects.push(...arr);
    console.log("first", createdMediaObjects[0]);
  }

  return createdMediaObjects;
};

export const createOrUpdateGraphQlObjectsUsingIntrospection = async (
  objectType: ObjectTypes,
  airtableRecords: Records<FieldSet>
): Promise<GraphQLBaseObject[]> => {
  const validProperties = await getValidPropertiesForObject(objectType);

  const externalIds = airtableRecords.map(({ id }) => id);

  const existingObjects = await getExistingObjects(objectType, externalIds);

  const operations = airtableRecords.reduce(
    (previousOperations, { id, fields }) => {
      const validFields = getValidFields(fields, validProperties);

      const objectExists = existingObjects.includes(id);
      const method = objectExists
        ? `update${objectType}`
        : `create${objectType}`;

      const operation = {
        __aliasFor: method,
        __args: objectExists
          ? {
              external_id: id,
              [objectType.toLowerCase()]: {
                ...validFields,
              },
            }
          : {
              [objectType.toLowerCase()]: {
                ...validFields,
                external_id: id,
              },
            },
        uid: true,
        external_id: true,
      };

      const updatedOperations = {
        ...previousOperations,
        [`${method}${id}`]: operation,
      };
      return updatedOperations;
    },
    {} as { [key: string]: object }
  );

  const mutation = {
    mutation: {
      __name: `createOrUpdate${objectType}s`,
      ...operations,
    },
  };

  const graphQLMutation = jsonToGraphQLQuery(mutation, { pretty: true });

  const data = await createOrUpdateMultipleObjects(graphQLMutation);

  return data;
};

export const createOrUpdateGraphQLCredits = async (
  airtableRecords: Records<FieldSet>,
  metadata: GraphQLMetadata
): Promise<GraphQLBaseObject[]> => {
  const validProperties = await getValidPropertiesForObject("Credit");

  const externalIds = airtableRecords.map(({ id }) => id);
  const existingObjects = await getExistingObjects("Credit", externalIds);

  const operations = [airtableRecords[0]].reduce(
    (previousOperations, { id, fields }) => {
      const validFields = getValidFields(fields, validProperties);

      const {
        person: [personField],
        role: [roleField],
      } = fields as { person: string[]; role: string[] };
      const person = metadata.people.find(
        ({ external_id }) => getExtId(external_id) === personField
      );
      const role = metadata.roles.find(
        ({ external_id }) => getExtId(external_id) === roleField
      );

      if (!person || !role) {
        return previousOperations;
      }

      const creditExists = existingObjects.includes(id);
      const method = creditExists ? `updateCredit` : `createCredit`;

      const credit = {
        relationships: {
          people: {
            link: person.uid,
          },
          roles: {
            link: role.uid,
          },
        },
        ...validFields,
      };

      const operation = {
        ...previousOperations,
        [`${method}${id}`]: {
          __aliasFor: method,
          __args: creditExists
            ? {
                external_id: id,
                credit,
              }
            : {
                credit: {
                  ...credit,
                  external_id: id,
                },
              },
          uid: true,
          external_id: true,
        },
      };
      return operation;
    },
    {} as { [key: string]: object }
  );

  const mutation = {
    mutation: {
      __name: "createOrUpdateCredits",
      ...operations,
    },
  };

  const graphQLMutation = jsonToGraphQLQuery(mutation, { pretty: true });

  const data = await createOrUpdateMultipleObjects(graphQLMutation);

  return data;
};

interface SetItem {
  uid: string;
  position: number;
  apiType: ApiObjectType | "set";
}

export const createOrUpdateSet = async (
  set: SetConfig,
  mediaObjects: GraphQLBaseObject[]
): Promise<GraphQLBaseObject> => {
  const validProperties = await getValidPropertiesForObject("Set");
  const validFields = getValidFields(
    { title: set.title, slug: set.slug } as FieldSet,
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

  const mutation = {
    mutation: {
      createSet: {
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

  const graphQLMutation = jsonToGraphQLQuery(mutation, { pretty: true });

  const [data] = await createOrUpdateMultipleObjects(graphQLMutation);

  return data;
};
