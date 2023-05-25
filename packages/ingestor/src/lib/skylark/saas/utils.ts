import { GraphQLObjectTypes } from "@skylark-reference-apps/lib";
import {
  Attachment,
  Collaborator,
  FieldSet,
  Record as AirtableRecord,
  Records,
} from "airtable";
import { EnumType } from "json-to-graphql-query";
import { has, isArray, isString } from "lodash";
import {
  GraphQLBaseObject,
  GraphQLIntrospectionProperties,
  GraphQLMetadata,
} from "../../interfaces";

export const pause = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

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
  type: GraphQLObjectTypes | string
): {
  createFunc: string;
  updateFunc: string;
  objectType: GraphQLObjectTypes;
  argName: string;
  relName: string;
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
    case "SkylarkAsset":
      return {
        createFunc: "createSkylarkAsset",
        updateFunc: "updateSkylarkAsset",
        objectType: "SkylarkAsset",
        argName: "skylark_asset",
        relName: "assets",
      };
    case "brands":
    case "Brand":
      return {
        createFunc: "createBrand",
        updateFunc: "updateBrand",
        objectType: "Brand",
        argName: "brand",
        relName: "brands",
      };
    case "CallToAction":
      return {
        createFunc: "createCallToAction",
        updateFunc: "updateCallToAction",
        objectType: "CallToAction",
        argName: "call_to_action",
        relName: "call_to_actions",
      };
    default:
      throw new Error(`Case ${type} does not have values`);
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
      [property]:
        kind === "ENUM"
          ? new EnumType(val as string)
          : (val as string | number | boolean | EnumType),
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
    __typename: true,
    uid: true,
    slug: true,
    external_id: true,
  };

  return { operation, method };
};

export const getGraphQLObjectAvailability = (
  availabilityMetadata: GraphQLMetadata["availability"],
  availabilityField?: string[]
): { link: string[] } => {
  const { default: defaultAvailability } = availabilityMetadata;
  if (!availabilityField || availabilityField.length === 0) {
    return { link: defaultAvailability ? [defaultAvailability] : [] };
  }

  return { link: availabilityField || [] };
};

export const getLanguageCodesFromAirtable = (
  languagesTable: Records<FieldSet>
) => {
  const languageCodes: { [key: string]: string } = {};
  languagesTable
    .filter(({ fields }) => has(fields, "code") && isString(fields.code))
    .forEach(({ fields, id }) => {
      languageCodes[id] = fields.code as string;
    });

  return languageCodes;
};

// Utility filter to remove either SLXDemo content OR StreamTV content depending on what Airtable data we want in the environment
export const filterSLXDemos = (
  table: string,
  record: AirtableRecord<FieldSet>,
  removeSLXDemoContent: boolean
) => {
  const tablesToFilter: string[] = [
    "Media Content",
    "Media Content - Translations",
    "roles",
    "people",
    "images",
    "sets-metadata",
  ];
  const SLX_PREFIX = "SLX";

  const { title, slx_demo_only: slxDemoOnly } = record.fields;

  if (!tablesToFilter.includes(table)) {
    return true;
  }

  const isSLXDemoContent =
    (title && isString(title) && title.startsWith(SLX_PREFIX)) || slxDemoOnly;
  if (removeSLXDemoContent) {
    // If we want to remove the SLX Demo Content, rather than remove anything but it
    return !isSLXDemoContent;
  }

  return isSLXDemoContent;
};

export const hasProperty = <T, K extends PropertyKey>(
  object: T,
  property: K
): object is T & Record<K, unknown> =>
  Object.prototype.hasOwnProperty.call(object, property);
