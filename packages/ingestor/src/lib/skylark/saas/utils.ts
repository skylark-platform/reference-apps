import {
  GraphQLMediaObjectTypes,
  GraphQLObjectTypes,
} from "@skylark-reference-apps/lib";
import { Attachment, Collaborator } from "airtable";
import { EnumType } from "json-to-graphql-query";
import { has, isArray } from "lodash";
import { GraphQLBaseObject, GraphQLIntrospectionProperties, GraphQLMetadata } from "../../interfaces";
import { ApiObjectType } from "../../types";

export const getExtId = (externalId: string) =>
  externalId.substring(externalId.indexOf("#") + 1);

export const getUidsFromField = (
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

export const gqlObjectMeta = (
  type: ApiObjectType | GraphQLMediaObjectTypes
): {
  createFunc: string;
  updateFunc: string;
  objectType: GraphQLMediaObjectTypes;
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

export const getValidFields = (
  fields: {
    [key: string]:
      | EnumType
      | undefined
      | string
      | number
      | boolean
      | Collaborator
      | ReadonlyArray<Collaborator>
      | ReadonlyArray<string>
      | ReadonlyArray<Attachment>;
  },
  validProperties: GraphQLIntrospectionProperties[]
): { [key: string]: string | number | boolean | EnumType } => {
  const validObjectFields = validProperties.filter(({ property }) =>
    has(fields, property)
  );
  const validFields = validObjectFields.reduce((obj, { property, kind }) => {
    const val = isArray(fields[property])
      ? (fields[property] as string[])[0]
      : fields[property];
    return {
      ...obj,
      [property]: kind === "ENUM" ? new EnumType(val as string) : val as string | number | boolean | EnumType,
    };
  }, {} as { [key: string]: string | number | boolean | EnumType });

  return validFields;
};

export const createGraphQLOperation = (
  objectType: GraphQLObjectTypes,
  objectExists: boolean,
  args: { [key: string]: string | number | boolean | object },
  updateLookupFields: { [key: string]: string }
) => {
  const method = objectExists ? `update${objectType}` : `create${objectType}`;

  const operation = {
    __aliasFor: method,
    __args: objectExists
      ? {
          ...updateLookupFields,
          ...args,
        }
      : {
          ...args,
        },
    uid: true,
    slug: true,
    external_id: true,
  };

  return { operation, method };
};

export const getGraphQLObjectAvailability = (
  availabilityMetadata: GraphQLMetadata["availability"],
  availabilityField?: string[],
): { link: string[] } => {
  const { all, default: defaultAvailability } = availabilityMetadata;
  if (!availabilityField || availabilityField.length === 0) {
    return { link: defaultAvailability ? [defaultAvailability.uid] : [] };
  }

  const uids = getUidsFromField(availabilityField, all);
  return { link: uids || [] };
};
