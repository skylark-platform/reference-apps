import { DimensionTypes, graphQLClient } from "@skylark-reference-apps/lib";
import { Record, FieldSet } from "airtable";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import {
  Airtables,
  AvailabilityTableFields,
  GraphQLBaseObject,
  GraphQLDimension,
  GraphQLMetadata,
  GraphQLIntrospectionProperties,
} from "../../interfaces";
import { mutateMultipleObjects } from "./create";
import { getExistingObjects, getValidPropertiesForObject } from "./get";
import { createGraphQLOperation, getValidFields } from "./utils";

const dimensionsConfig: { slug: DimensionTypes; title: string }[] = [
  {
    title: "Affiliates",
    slug: "affiliates",
  },
  {
    title: "Customer Type",
    slug: "customer-types",
  },
  {
    title: "Device Type",
    slug: "device-types",
  },
  {
    title: "Locales",
    slug: "locales",
  },
  {
    title: "Languages",
    slug: "languages",
  },
  {
    title: "Operating Systems",
    slug: "operating-systems",
  },
  {
    title: "Regions",
    slug: "regions",
  },
  {
    title: "Viewing Context",
    slug: "viewing-context",
  },
];

const getExistingDimensions = async () => {
  const query = {
    query: {
      __name: "listDimensions",
      listDimensions: {
        uid: true,
        title: true,
        slug: true,
        description: true,
        _meta: {
          values: {
            uid: true,
            title: true,
            slug: true,
          },
        },
      },
    },
  };

  const graphQLQuery = jsonToGraphQLQuery(query, { pretty: true });

  const data = await graphQLClient.request<{
    listDimensions: GraphQLDimension[];
  }>(graphQLQuery);

  return data.listDimensions;
};

export const createDimensions = async () => {
  const existingTypes: GraphQLDimension[] = await getExistingDimensions();
  const existingSlugs = existingTypes.map(({ slug }) => slug);

  const dimensionsToCreate = dimensionsConfig.filter(
    ({ slug }) => !existingSlugs.includes(slug)
  );

  const operations = dimensionsToCreate.reduce(
    (previousOperations, { slug, title }) => {
      const operation = {
        __aliasFor: "createDimension",
        __args: {
          dimension: {
            slug,
            title,
          },
        },
        uid: true,
        title: true,
        slug: true,
        description: true,
      };

      const updatedOperations: { [key: string]: object } = {
        ...previousOperations,
        [`createDimension${title.replace(/\s/g, "")}`]: operation,
      };
      return updatedOperations;
    },
    {} as { [key: string]: object }
  );

  const arr = await mutateMultipleObjects<GraphQLDimension>(
    "createDimensions",
    operations
  );

  return arr;
};

const createOrUpdateDimensionValues = async (
  type: DimensionTypes,
  validProperties: GraphQLIntrospectionProperties[],
  airtableRecords: Record<FieldSet>[],
  dimensions: GraphQLDimension[]
) => {
  const dimension = dimensions.find(({ slug }) => slug === type);
  if (!dimension) {
    throw new Error(`Dimension: ${type} does not exist in Skylark`);
  }

  // eslint-disable-next-line no-underscore-dangle
  const existingObjectSlugs = dimension._meta.values.map(({ slug }) => slug);

  const operations = airtableRecords.reduce(
    (previousOperations, { fields, id }) => {
      const validFields = getValidFields(fields, validProperties);

      const objectExists = existingObjectSlugs.includes(fields.slug as string);

      const dimensionValue = {
        dimension_value: objectExists
          ? validFields
          : {
              ...validFields,
              external_id: id,
            },
      };

      const args = objectExists
        ? {
            ...dimensionValue,
          }
        : {
            dimension_id: type,
            ...dimensionValue,
          };

      const { operation, method } = createGraphQLOperation(
        "DimensionValue",
        objectExists,
        args,
        { dimension_id: type, value_external_id: id }
      );

      const updatedOperations: { [key: string]: object } = {
        ...previousOperations,
        [`${method}${id}`]: operation,
      };
      return updatedOperations;
    },
    {} as { [key: string]: object }
  );

  const arr = await mutateMultipleObjects<GraphQLBaseObject>(
    "createOrUpdateDimensionValues",
    operations
  );

  return arr;
};

export const createOrUpdateScheduleDimensionValues = async (
  airtable: Airtables["dimensions"]
): Promise<GraphQLMetadata["dimensions"]> => {
  const dimensionValues: { type: DimensionTypes; data: Record<FieldSet>[] }[] =
    [
      { type: "affiliates", data: airtable.affiliates },
      { type: "customer-types", data: airtable.customerTypes },
      { type: "device-types", data: airtable.deviceTypes },
      { type: "locales", data: airtable.locales },
      { type: "operating-systems", data: airtable.operatingSystems },
      { type: "regions", data: airtable.regions },
      { type: "viewing-context", data: airtable.viewingContext },
    ];

  const dimensions: GraphQLDimension[] = await getExistingDimensions();
  const validProperties = await getValidPropertiesForObject("DimensionValue");

  const [
    affiliates,
    customerTypes,
    deviceTypes,
    locales,
    operatingSystems,
    regions,
    viewingContext,
  ] = await Promise.all(
    dimensionValues.map(({ data, type }) =>
      createOrUpdateDimensionValues(type, validProperties, data, dimensions)
    )
  );
  return {
    affiliates,
    customerTypes,
    deviceTypes,
    locales,
    operatingSystems,
    regions,
    viewingContext,
  };
};

const getValueSlugs = (
  dimensionValues: GraphQLBaseObject[],
  dimensionAirtableField?: string[]
) =>
  dimensionValues
    .filter(({ external_id }) => dimensionAirtableField?.includes(external_id))
    .map(({ slug }) => slug);

export const createOrUpdateAvailability = async (
  schedules: Record<FieldSet>[],
  dimensions: GraphQLMetadata["dimensions"]
) => {
  const externalIds = schedules.map(({ id }) => id);
  const existingObjects = await getExistingObjects("Availability", externalIds);

  const operations = schedules.reduce(
    (previousOperations, { id, ...record }) => {
      const fields = record.fields as AvailabilityTableFields;

      const objectExists = existingObjects.includes(id);

      const availabilityInput: {
        title: string;
        slug: string;
        start?: string;
        end?: string;
        dimensions?: {
          dimension_slug: DimensionTypes;
          value_slugs: string[];
        }[];
      } = {
        title: fields.title,
        slug: fields.slug,
      };

      const availabilityDimensions: {
        dimension_slug: DimensionTypes;
        value_slugs: string[];
      }[] = [
        {
          dimension_slug: "affiliates",
          value_slugs: getValueSlugs(dimensions.affiliates, fields.affiliates),
        },
        {
          dimension_slug: "customer-types",
          value_slugs: getValueSlugs(
            dimensions.customerTypes,
            fields.customers
          ),
        },
        {
          dimension_slug: "device-types",
          value_slugs: getValueSlugs(dimensions.deviceTypes, fields.devices),
        },
        {
          dimension_slug: "locales",
          value_slugs: getValueSlugs(dimensions.locales, fields.locales),
        },
        {
          dimension_slug: "operating-systems",
          value_slugs: getValueSlugs(
            dimensions.operatingSystems,
            fields["operating-systems"]
          ),
        },
        {
          dimension_slug: "regions",
          value_slugs: getValueSlugs(dimensions.regions, fields.regions),
        },
        {
          dimension_slug: "viewing-context",
          value_slugs: getValueSlugs(
            dimensions.viewingContext,
            fields["viewing-context"]
          ),
        },
      ];

      // Filter out any dimensions that are empty, only add the dimensions property to the input if at least one dimension is given
      const filteredDimensions = availabilityDimensions.filter(
        ({ value_slugs }) => value_slugs.length > 0
      );
      if (filteredDimensions.length > 0) {
        availabilityInput.dimensions = filteredDimensions;
      }

      // Only include start / end field when it exists in Airtable, Skylark errors otherwise
      if (fields.starts) {
        availabilityInput.start = fields.starts;
      }
      if (fields.ends) {
        availabilityInput.end = fields.ends;
      }

      const args = objectExists
        ? { availability: availabilityInput }
        : {
            availability: {
              external_id: id,
              ...availabilityInput,
            },
          };

      const { operation, method } = createGraphQLOperation(
        "Availability",
        objectExists,
        args,
        { external_id: id }
      );

      const updatedOperations = {
        ...previousOperations,
        [`${method}${id}`]: operation,
      };
      return updatedOperations;
    },
    {} as { [key: string]: object }
  );

  const arr = await mutateMultipleObjects<GraphQLBaseObject>(
    "createOrUpdateAvailability",
    operations
  );

  return arr;
};
