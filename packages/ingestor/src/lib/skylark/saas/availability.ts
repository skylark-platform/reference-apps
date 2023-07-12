import { DimensionTypes, graphQLClient } from "@skylark-reference-apps/lib";
import { Record, FieldSet } from "airtable";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { gql } from "graphql-request";
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
    title: "Customer Type",
    slug: "customer-types",
  },
  {
    title: "Device Type",
    slug: "device-types",
  },
];

const getExistingDimensions = async (
  nextToken?: string
): Promise<GraphQLDimension[]> => {
  const query = {
    query: {
      __name: "listDimensions",
      listDimensions: {
        __args: {
          limit: 50,
          next_token: nextToken || "",
        },
        objects: {
          __typename: true,
          uid: true,
          title: true,
          slug: true,
          description: true,
        },
        count: true,
        next_token: true,
      },
    },
  };

  const graphQLQuery = jsonToGraphQLQuery(query, { pretty: true });

  const data = await graphQLClient.request<{
    listDimensions: { objects: GraphQLDimension[]; next_token: string };
  }>(graphQLQuery);

  if (data.listDimensions.next_token) {
    const some = await getExistingDimensions(data.listDimensions.next_token);
    return [...data.listDimensions.objects, ...some];
  }

  return data.listDimensions.objects;
};

const getExistingDimensionValues = async (
  slug: string,
  nextToken?: string
): Promise<GraphQLBaseObject[]> => {
  const query = {
    query: {
      __name: "getDimensionValues",
      getDimension: {
        __args: {
          dimension_id: slug, // or uid, slug OR we can use external ID
        },
        values: {
          __args: {
            next_token: nextToken || "",
          },
          count: true,
          next_token: true,
          objects: {
            __typename: true,
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
    getDimension: {
      values: { next_token: string; objects: GraphQLBaseObject[] };
    };
  }>(graphQLQuery);

  const { objects } = data.getDimension.values;

  if (data.getDimension.values.next_token) {
    const some = await getExistingDimensionValues(
      slug,
      data.getDimension.values.next_token
    );
    return [...objects, ...some];
  }

  return objects;
};

export const createDimensions = async () => {
  const existingTypes: GraphQLDimension[] = await getExistingDimensions();

  const existingSlugs = existingTypes.map(({ slug }) => slug);

  const operations = dimensionsConfig.reduce(
    (previousOperations, { slug, title }) => {
      const objectExists = existingSlugs.includes(slug);

      const dimension = objectExists
        ? { title }
        : {
            title,
            slug,
          };

      const { operation, method } = createGraphQLOperation(
        "Dimension",
        objectExists,
        { dimension },
        { dimension_id: slug }
      );

      const updatedOperations: { [key: string]: object } = {
        ...previousOperations,
        [`${method}${title.replace(/\s/g, "")}`]: operation,
      };

      return updatedOperations;
    },
    {} as { [key: string]: object }
  );

  const arr = await mutateMultipleObjects<GraphQLDimension>(
    "createOrUpdateDimensions",
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

  const existingDimensionValues = await getExistingDimensionValues(
    dimension.slug
  );
  const existingObjectSlugs = existingDimensionValues.map(({ slug }) => slug);

  const operations = airtableRecords.reduce(
    (previousOperations, { fields, id }) => {
      const validFields = getValidFields(fields, validProperties);

      const objectExists = existingObjectSlugs.includes(fields.slug as string);

      if (objectExists) {
        // When updating dimensions, changing the slug isn't supported
        delete validFields.slug;
      }

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
      { type: "customer-types", data: airtable.customerTypes },
      { type: "device-types", data: airtable.deviceTypes },
    ];

  const dimensions: GraphQLDimension[] = await getExistingDimensions();
  const validProperties = await getValidPropertiesForObject("DimensionValue");

  const [customerTypes, deviceTypes] = await Promise.all(
    dimensionValues.map(({ data, type }) =>
      createOrUpdateDimensionValues(type, validProperties, data, dimensions)
    )
  );
  return {
    customerTypes,
    deviceTypes,
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
  const externalIds = schedules.map(({ id }) => ({ externalId: id }));
  const { existingObjects } = await getExistingObjects(
    "Availability",
    externalIds
  );

  const schedulesToCreate = schedules.filter(
    ({ id }) => !existingObjects.has(id)
  );
  if (schedulesToCreate.length === 0) {
    return;
  }

  const operations = schedulesToCreate.reduce(
    (previousOperations, { id, ...record }) => {
      const fields = record.fields as AvailabilityTableFields;

      const objectExists = existingObjects.has(id);

      const availabilityInput: {
        title: string;
        slug: string;
        start?: string;
        end?: string;
        dimensions?: {
          link: {
            dimension_slug: DimensionTypes;
            value_slugs: string[];
          }[];
        };
      } = {
        title: fields.title,
        slug: fields.slug,
      };

      const availabilityDimensions: {
        dimension_slug: DimensionTypes;
        value_slugs: string[];
      }[] = [
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
      ];

      // Filter out any dimensions that are empty, only add the dimensions property to the input if at least one dimension is given
      const filteredDimensions = availabilityDimensions.filter(
        ({ value_slugs }) => value_slugs.length > 0
      );
      if (filteredDimensions.length > 0) {
        availabilityInput.dimensions = {
          link: filteredDimensions,
        };
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

  await mutateMultipleObjects<GraphQLBaseObject>(
    "createOrUpdateAvailability",
    operations
  );
};

export const createAlwaysAndForeverAvailability = async (
  externalId: string
): Promise<GraphQLBaseObject> => {
  const GET_QUERY = gql`
    query GET_ALWAYS_AVAILABILITY($externalId: String!) {
      getAvailability(external_id: $externalId) {
        __typename
        uid
        external_id
        slug
      }
    }
  `;

  const CREATE_MUTATION = gql`
    mutation CREATE_ALWAYS_AVAILABILITY($externalId: String!) {
      createAvailability(
        availability: {
          title: "Always & Forever"
          external_id: $externalId
          slug: "skylark_legacy_ingest_availability"
        }
      ) {
        __typename
        uid
        external_id
        slug
      }
    }
  `;

  let existingAvailability: GraphQLBaseObject | undefined;
  try {
    const data = await graphQLClient.request<{
      getAvailability: GraphQLBaseObject;
    }>(GET_QUERY, {
      externalId,
    });
    existingAvailability = data.getAvailability;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("--- Always & Forever Availability not found");
  }

  if (existingAvailability?.uid) {
    // eslint-disable-next-line no-console
    console.log("--- Always & Forever Availability already exists");
    return existingAvailability;
  }

  const data = await graphQLClient.request<{
    createAvailability: GraphQLBaseObject;
  }>(CREATE_MUTATION, {
    externalId,
  });
  // eslint-disable-next-line no-console
  console.log("--- Always & Forever Availability created");

  return data.createAvailability;
};
