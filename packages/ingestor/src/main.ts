// Import dotenv must be first
import "./env";
import { SAAS_API_ENDPOINT, hasProperty } from "@skylark-reference-apps/lib";
import axios from "axios";
import { has } from "lodash";
import { getAllTables } from "./lib/airtable";
import { GraphQLBaseObject, GraphQLMetadata } from "./lib/interfaces";
import { orderedSetsToCreate } from "./additional-objects/sets";
import { UNLICENSED_BY_DEFAULT } from "./lib/constants";
import {
  createGraphQLMediaObjects,
  createOrUpdateGraphQLCredits,
  createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection,
  createTranslationsForGraphQLObjects,
} from "./lib/skylark/saas/create";
import { createOrUpdateGraphQLSet } from "./lib/skylark/saas/sets";
import {
  createDimensions,
  createOrUpdateAvailability,
  createOrUpdateScheduleDimensionValues,
  showcaseDimensionsConfig,
} from "./lib/skylark/saas/availability";
import { slxDemoSetsToCreate } from "./additional-objects/slxDemosSets";
import { updateSkylarkSchema } from "./lib/skylark/saas/schema";
import {
  clearUnableToFindVersionNoneObjectsFile,
  writeAirtableOutputFile,
} from "./lib/skylark/saas/fs";

const main = async () => {
  await clearUnableToFindVersionNoneObjectsFile();

  // eslint-disable-next-line no-console
  console.time("Completed in:");

  const shouldCreateAdditionalStreamTVObjects =
    process.env.CREATE_SETS === "true";
  const shouldCreateAdditionalSLXDemoObjects =
    process.env.CREATE_SLX_DEMO_SETS === "true";
  // eslint-disable-next-line no-console
  console.log(
    `Additional StreamTV sets / dynamic objects creation ${
      shouldCreateAdditionalStreamTVObjects ? "enabled" : "disabled"
    }`
  );
  // eslint-disable-next-line no-console
  console.log(
    `Additional SLX Demo sets / dynamic objects creation ${
      shouldCreateAdditionalSLXDemoObjects ? "enabled" : "disabled"
    }`
  );

  // eslint-disable-next-line no-console
  const airtable = await getAllTables();

  // eslint-disable-next-line no-console
  console.log(`Starting ingest to Skylark X: ${SAAS_API_ENDPOINT}`);

  const assetTypes = airtable.assetTypes
    .map(({ fields }) => hasProperty(fields, "enum") && fields.enum)
    .filter((val): val is string => typeof val === "string");
  const imageTypes = airtable.imageTypes
    .map(({ fields }) => hasProperty(fields, "enum") && fields.enum)
    .filter((val): val is string => typeof val === "string");
  const tagTypes = airtable.tagTypes
    .map(({ fields }) => hasProperty(fields, "enum") && fields.enum)
    .filter((val): val is string => typeof val === "string");

  const { version } = await updateSkylarkSchema({
    assetTypes,
    imageTypes,
    tagTypes,
  });
  // eslint-disable-next-line no-console
  console.log("Schema updated to version:", version);

  // Comment updateObjectConfigurations as we can use the defaults
  // await updateObjectConfigurations();
  // // eslint-disable-next-line no-console
  // console.log("Object configuration updated");

  await createDimensions(showcaseDimensionsConfig);

  const dimensions = await createOrUpdateScheduleDimensionValues(
    airtable.dimensions
  );

  await createOrUpdateAvailability(airtable.availability, dimensions);

  const defaultSchedule = airtable.availability.find(
    ({ fields }) =>
      has(fields, "default") && fields.default && has(fields, "slug")
  );

  // eslint-disable-next-line no-console
  console.log(
    `Default license: ${
      UNLICENSED_BY_DEFAULT || !defaultSchedule
        ? "undefined"
        : `${defaultSchedule?.fields.slug as string} (${defaultSchedule.id})`
    }`
  );

  const metadataAvailability: GraphQLMetadata["availability"] = {
    // We use the Airtable IDs (external_id within Skylark) for Availability
    all: airtable.availability.map(({ id }) => id),
    default: UNLICENSED_BY_DEFAULT ? undefined : defaultSchedule?.id,
  };

  const metadata: GraphQLMetadata = {
    dimensions,
    availability: metadataAvailability,
    people: [],
    roles: [],
    genres: [],
    themes: [],
    ratings: [],
    tags: [],
    credits: [],
    images: [],
    call_to_actions: [],
  };

  metadata.call_to_actions =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "CallToAction",
      airtable.callToActions,
      metadataAvailability
    );
  metadata.images =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "SkylarkImage",
      airtable.images,
      metadataAvailability,
      true
    );
  metadata.themes =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "Theme",
      airtable.themes,
      metadataAvailability
    );
  metadata.genres =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "Genre",
      airtable.genres,
      metadataAvailability
    );
  metadata.ratings =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "Rating",
      airtable.ratings,
      metadataAvailability
    );
  metadata.tags =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "SkylarkTag",
      airtable.tags,
      metadataAvailability
    );
  metadata.people =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "Person",
      airtable.people,
      metadataAvailability
    );
  metadata.roles =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "Role",
      airtable.roles,
      metadataAvailability
    );
  metadata.credits = await createOrUpdateGraphQLCredits(
    airtable.credits,
    metadata
  );

  await createTranslationsForGraphQLObjects(
    metadata.call_to_actions,
    airtable.translations.callToActions,
    airtable.languages
  );

  await createTranslationsForGraphQLObjects(
    metadata.themes,
    airtable.translations.themes,
    airtable.languages
  );

  await createTranslationsForGraphQLObjects(
    metadata.genres,
    airtable.translations.genres,
    airtable.languages
  );

  await createTranslationsForGraphQLObjects(
    metadata.credits,
    airtable.translations.credits,
    airtable.languages
  );

  await createTranslationsForGraphQLObjects(
    metadata.roles,
    airtable.translations.roles,
    airtable.languages
  );

  // eslint-disable-next-line no-console
  console.log("Metadata objects created");

  const mediaObjects = await createGraphQLMediaObjects(
    airtable.mediaObjects,
    metadata,
    airtable.languages
  );

  // eslint-disable-next-line no-console
  console.log("Media objects created");

  const createdSets: GraphQLBaseObject[] = [];
  if (shouldCreateAdditionalStreamTVObjects) {
    for (let i = 0; i < orderedSetsToCreate.length; i += 1) {
      const setConfig = orderedSetsToCreate[i];
      // eslint-disable-next-line no-await-in-loop
      const set = await createOrUpdateGraphQLSet(
        setConfig,
        [...mediaObjects, ...createdSets],
        metadata,
        airtable.languages,
        airtable.setsMetadata
      );
      if (set) createdSets.push(set);
    }

    // eslint-disable-next-line no-console
    console.log("Additional StreamTV objects created");
  }

  if (shouldCreateAdditionalSLXDemoObjects) {
    for (let i = 0; i < slxDemoSetsToCreate.length; i += 1) {
      const setConfig = slxDemoSetsToCreate[i];
      // eslint-disable-next-line no-await-in-loop
      const set = await createOrUpdateGraphQLSet(
        setConfig,
        [...mediaObjects, ...createdSets],
        metadata,
        airtable.languages,
        airtable.setsMetadata
      );
      if (set) createdSets.push(set);
    }

    // eslint-disable-next-line no-console
    console.log("Additional SLX Demo objects created");
  }

  await createTranslationsForGraphQLObjects(
    mediaObjects,
    airtable.translations.mediaObjects,
    airtable.languages
  );

  // eslint-disable-next-line no-console
  console.log("Media object translations created");

  const dateStamp = new Date().toISOString();
  const output = {
    environment_meta: {
      date_stamp: dateStamp,
      endpoint: SAAS_API_ENDPOINT,
    },
    airtable_data: airtable,
    metadata,
    media_objects: mediaObjects,
    sets: createdSets,
  };

  await writeAirtableOutputFile(dateStamp, output);

  // eslint-disable-next-line no-console
  console.timeEnd("Completed in:");
  // eslint-disable-next-line no-console
  console.log("great success");
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Error while ingesting to Skylark");
  // eslint-disable-next-line no-console
  console.error(err);
  if (axios.isAxiosError(err) && err.response) {
    // eslint-disable-next-line no-console
    console.log("Axios response status: ", err.response.status);
  }
  process.exit(1);
});
