import { FieldSet, Records, Record } from 'airtable'
import { GraphQLClient, gql, BatchRequestDocument, Variables } from 'graphql-request'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { has, indexOf, isArray, isEmpty, isString, values } from 'lodash'
import { ApiEntertainmentObjectWithAirtableId, ApiObjectType, GraphQLBaseObject, GraphQLMetadata, SetConfig } from '../../../interfaces'

type MediaObjectTypes = "Brand" | "Season" | "Episode" | "Movie" | "Asset"
type ObjectTypes = MediaObjectTypes | "Theme" | "Genre" | "Rating" | "Person" | "Role" | "Tag" | "Credit"
type SkylarkObjectType = "brands" | "seasons" | "episodes" | "movies" | "assets";

const endpoint = 'https://qr6ydgprtjajhk4g6grz64i2yi.appsync-api.eu-west-1.amazonaws.com/graphql'

const account = (new Date()).toISOString()
// const account = "test12"

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      "x-api-key": 'da2-eebyrzq45zctlhnbadz3yudiuq',
      "x-account-id": account
    },
  })

const gqlObjectMeta = (type: SkylarkObjectType | MediaObjectTypes): {
  createFunc: string
  updateFunc: string
  objectType: MediaObjectTypes
  argName: "brand" | "season" | "episode" | "movie" | "asset"
  relName: "brands" | "seasons" | "episodes" | "movies" | "assets"
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
      }
    case "seasons":
    case "Season":
      return {
        createFunc: "createSeason",
        updateFunc: "updateSeason",
        objectType: "Season",
        argName: "season",
        relName: "seasons",
      }
    case "movies":
    case "Movie":
      return {
        createFunc: "createMovie",
        updateFunc: "updateMovie",
        objectType: "Movie",
        argName: "movie",
        relName: "movies",
      }
    case "assets":
    case "Asset":
      return {
        createFunc: "createAsset",
        updateFunc: "updateAsset",
        objectType: "Asset",
        argName: "asset",
        relName: "assets",
      }
    default:
      return {
        createFunc: "createBrand",
        updateFunc: "updateBrand",
        objectType: "Brand",
        argName: "brand",
        relName: "brands",
      }
  }
}

const getExtId = (externalId: string) => externalId.substring(externalId.indexOf('#')+1)

const getValidFields = (fields: FieldSet, validProperties: string[]): { [key: string]: string | number | boolean } => {
  const validObjectFields = validProperties.filter((property) => has(fields, property));
  const validFields = validObjectFields.reduce((obj, property) => {
    const val = isArray(fields[property]) ? (fields[property] as string[])[0] : fields[property];
    return {
      ...obj,
      [property]: val as string | number | boolean
    }
  }, {} as { [key: string]: string | number | boolean })

  return validFields;
}

const createOrUpdateMultipleObjects = async(mutation: string): Promise<GraphQLBaseObject[]> => {
  const data = await graphQLClient.request<{ [key: string]: GraphQLBaseObject}>(mutation)

  console.log(JSON.stringify(data, undefined, 2))

  const arr = values(data);

  console.log(arr)

  return arr;
}

const getValidPropertiesForObject = async(objectType: ObjectTypes) => {
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
`
  interface IIntrospectionType {
    __type: {
      name: string
      fields: {
        name: string
        type: {
          name: string
          kind: string
        }
      }[]
    }
  }

  const data = await graphQLClient.request<IIntrospectionType>(query)

  console.log(data)

  // eslint-disable-next-line no-underscore-dangle
  const types = data.__type.fields.filter(({ type: { name, kind } }) => kind !== "OBJECT" || (name && name.startsWith("String"))).map(({ name }) => name);

  return types
}

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

export const createGraphQLMediaObjects = async(airtableRecords: Records<FieldSet>, metadata: GraphQLMetadata) => {
  const validObjectProperties: { [key in MediaObjectTypes]: string[] } = {
    Episode: await getValidPropertiesForObject("Episode"),
    Season: await getValidPropertiesForObject("Season"),
    Brand: await getValidPropertiesForObject("Brand"),
    Movie: await getValidPropertiesForObject("Movie"),
    Asset: await getValidPropertiesForObject("Asset"),
  }

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

    const operations = objectsToCreateUpdate.reduce((previousOperations, { id, fields }) => {
      if(!has(fields, "title") || !has(fields, "slug") || !isString(fields.title) || !isString(fields.slug)) {
        return {};
      }

      const { objectType, argName, createFunc } = gqlObjectMeta(fields.skylark_object_type as SkylarkObjectType);

      const validFields = getValidFields(fields, validObjectProperties[objectType])

      const relationships: { [key: string]: { link: string | string[] } } = {}

      const parentField = fields.parent as string[];
      if(parentField && parentField.length > 0) {
        const parent = createdMediaObjects.find(({ external_id }) =>
          (parentField[0] === getExtId(external_id))
        );

        if (parent) {
          // eslint-disable-next-line no-underscore-dangle
          const { relName } = gqlObjectMeta(parent?.__typename as MediaObjectTypes);
          relationships[relName] = { link: parent.uid }
        }
      }

      const themeUids = getUidsFromField(
        fields.themes as string[],
        metadata.themes
      );
      if(themeUids && themeUids.length > 0) {
        relationships.themes = { link: themeUids }
      }

      const genreUids = getUidsFromField(
        fields.genres as string[],
        metadata.genres
      );
      if(genreUids && genreUids.length > 0) {
        relationships.genres = { link: genreUids }
      }

      const ratingUids = getUidsFromField(
        fields.ratings as string[],
        metadata.ratings
      );
      if(ratingUids && ratingUids.length > 0) {
        relationships.ratings = { link: ratingUids }
      }

      const tagUids = getUidsFromField(
        fields.tags as string[],
        metadata.tags
      );
      if(tagUids && tagUids.length > 0) {
        relationships.tags = { link: tagUids }
      }

      const creditUids = getUidsFromField(
        fields.credits as string[],
        metadata.credits
      );
      if(creditUids && creditUids.length > 0) {
        relationships.credits = { link: creditUids }
      }

      const operation: { [key: string]: object } = {
        ...previousOperations,
        [`${createFunc}_${id}`]: {
          __aliasFor: createFunc,
          __args: {
            [argName]: {
              external_id: id,
              ...validFields,
              relationships,
            }
          },
          __typename: true,
          uid: true,
          external_id: true,
          title: true,
          slug: true,
        }
      }
      return operation;
    }, {} as { [key: string]: object } );

    const mutation = {
      mutation: {
        __name: "createMediaObjects",
        ...operations
      }
    }

    console.log("mutation", mutation)

    const graphQLMutation = jsonToGraphQLQuery(mutation, { pretty: true });

    // eslint-disable-next-line no-await-in-loop
    const arr = await createOrUpdateMultipleObjects(graphQLMutation);
    createdMediaObjects.push(...arr);
    console.log("first", createdMediaObjects[0])
  }

  return createdMediaObjects;
}

export const createGraphQlObjectsUsingIntrospection = async(objectType: ObjectTypes , airtableRecords: Records<FieldSet>): Promise<GraphQLBaseObject[]> => {
  const validProperties = await getValidPropertiesForObject(objectType);
  console.log(objectType, validProperties)

  const operations = airtableRecords.reduce((previousOperations, { id, fields }) => {
    const validFields = getValidFields(fields, validProperties)

    const operation = {
      ...previousOperations,
      [`create${objectType}${id}`]: {
        __aliasFor: `create${objectType}`,
        __args: {
          [objectType.toLowerCase()]: {
            external_id: id,
            ...validFields,
          }
        },
        uid: true,
        external_id: true,
      }
    }
    return operation;
  }, {} as { [key: string]: object } );

  const mutation = {
    mutation: {
      __name: `create${objectType}s`,
      ...operations
    }
  }

  const graphQLMutation = jsonToGraphQLQuery(mutation, { pretty: true });

  const data = await createOrUpdateMultipleObjects(graphQLMutation);

  return data;
}

export const createGraphQLCredits = async(airtableRecords: Records<FieldSet>, metadata: GraphQLMetadata): Promise<GraphQLBaseObject[]> => {
  const validProperties = await getValidPropertiesForObject("Credit");

  const operations = airtableRecords.reduce((previousOperations, { id, fields }) => {
    const validFields = getValidFields(fields, validProperties);

    const { person: [personField], role: [roleField] } = fields as { person: string[], role: string[] };
    const person = metadata.people.find(({ external_id }) => getExtId(external_id) === personField);
    const role = metadata.roles.find(({ external_id }) => getExtId(external_id) === roleField);

    if(!person || !role) {
      return previousOperations;
    }

    const operation = {
      ...previousOperations,
      [`createCredit${id}`]: {
        __aliasFor: 'createCredit',
        __args: {
          credit: {
            external_id: id,
            relationships: {
              people: {
                link: person.uid
              },
              roles: {
                link: role.uid
              }
            },
            ...validFields,
          }
        },
        uid: true,
        external_id: true,
      }
    }
    return operation;
  }, {} as { [key: string]: object } );

  const mutation = {
    mutation: {
      __name: "createCredits",
      ...operations
    }
  }

  const graphQLMutation = jsonToGraphQLQuery(mutation, { pretty: true });

  const data = await createOrUpdateMultipleObjects(graphQLMutation);

  return data;
}

interface SetItem {
  uid: string;
  position: number
  apiType: ApiObjectType
}

export const createSet = async(set: SetConfig, mediaObjects: GraphQLBaseObject[], metadata: GraphQLMetadata) => {
  const setItems = set.contents.map((content, index): SetItem => {
    const { slug } = content as { slug: string }
    const item = mediaObjects.find((object) => object.slug === slug);
    return {
      uid: item?.uid as string,
      position: index + 1,
      apiType: content.type as ApiObjectType
    }
  })


  const [episodes, seasons, movies, brands] =                             // Use "deconstruction" style assignment
  setItems
    .reduce((result, item) => {
      let arrayNum;
      switch (item.apiType) {
        case "episodes":
          arrayNum = 0;
          break;
        case "seasons":
          arrayNum = 1;
          break;
        case "movies":
          arrayNum = 2;
          break;
        default:
          arrayNum = 3;
          break;
      }
      result[arrayNum].push(item);
      return result;
    },
    [[], [], [], []] as [SetItem[], SetItem[], SetItem[], SetItem[]]);

  // const setContent = setItems.map((item) => {
  //   let objectType: ObjectTypes;
  //   switch (item.apiType) {
  //     case "episodes":
  //       objectType = "Episode";
  //       break;
  //     case "seasons":
  //       objectType = "Season";
  //       break;
  //     case "movies":
  //       objectType = "Movie";
  //       break;
  //     default:
  //       objectType = "Brand";
  //       break;
  //   }
  //   return `${objectType}: {link: {position: ${item.position}, uid: ${JSON.stringify(item.uid)} }}`
  // })

  const linkFunc = (item: SetItem) => `{ position: ${item.position}, uid: ${JSON.stringify(item.uid)} }`;

  const episodeQuery = episodes.length > 0 ? `Episode: {link: [${episodes.map(linkFunc).join(", ")}] }` : "";
  const seasonQuery = seasons.length > 0 ? `Season: {link: [${seasons.map(linkFunc).join(", ")}] }` : "";
  const movieQuery = movies.length > 0 ? `Movie: {link: [${movies.map(linkFunc).join(", ")}] }` : "";
  const brandQuery = brands.length > 0 ? `Brand: {link: [${brands.map(linkFunc).join(", ")}] }` : "";

  const mutation = gql`
    mutation {
      createSet(set: {content: {
        ${[episodeQuery, seasonQuery, movieQuery, brandQuery].join(",\n")}
      },
        title: ${JSON.stringify(set.title)}
      }) {
        title
      }
    }
  `

  console.log("set-mutation: ", mutation)

  const data = await graphQLClient.request<{ [key: string]: GraphQLBaseObject}>(mutation)

  console.log(JSON.stringify(data, undefined, 2))
}
