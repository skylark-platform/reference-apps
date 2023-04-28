// Import dotenv must be first
import "./env";
import { SAAS_API_ENDPOINT } from "@skylark-reference-apps/lib";
import axios from "axios";
import { mkdir, writeFile } from "fs/promises";
import { has } from "lodash";
import { getAllTables } from "./lib/airtable";
import { GraphQLBaseObject, GraphQLMetadata } from "./lib/interfaces";
import { orderedSetsToCreate } from "./additional-objects/sets";
import { UNLICENSED_BY_DEFAULT } from "./lib/constants";
import {
  createGraphQLMediaObjects,
  createOrUpdateGraphQLCredits,
  createOrUpdateGraphQlObjectsUsingIntrospection,
  createTranslationsForGraphQLObjects,
} from "./lib/skylark/saas/create";
import { createOrUpdateGraphQLSet } from "./lib/skylark/saas/sets";
import {
  createDimensions,
  createOrUpdateAvailability,
  createOrUpdateScheduleDimensionValues,
} from "./lib/skylark/saas/availability";
import { updateObjectConfigurations } from "./lib/skylark/saas/objectConfiguration";
import { slxDemoSetsToCreate } from "./additional-objects/slxDemosSets";
import { updateSkylarkSchema } from "./lib/skylark/saas/schema";

const main = async () => {
  // eslint-disable-next-line no-console
  console.time("Completed in:");

  const shouldCreateAdditionalObjects = process.env.CREATE_SETS === "true";
  // eslint-disable-next-line no-console
  console.log(
    `Additional StreamTV sets / dynamic objects creation ${
      shouldCreateAdditionalObjects ? "enabled" : "disabled"
    }`
  );

  // We keep StreamTV and SLX Demo data in the same Airtable, sometimes we don't want to add one type of content to an environment
  const contentTypeToIngest =
    (process.env.CONTENT_TYPE as "all" | "streamtv" | "slxdemos" | undefined) ||
    "all";
  // eslint-disable-next-line no-console
  console.log("Content type:", contentTypeToIngest);
  const airtable = await getAllTables(contentTypeToIngest);

  // eslint-disable-next-line no-console
  console.log(`Starting ingest to Skylark X: ${SAAS_API_ENDPOINT}`);

  const { version } = await updateSkylarkSchema();
  // eslint-disable-next-line no-console
  console.log("Schema updated to version:", version);

  await updateObjectConfigurations();
  // eslint-disable-next-line no-console
  console.log("Object configuration updated");

  await createDimensions();

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
  };

  metadata.images = await createOrUpdateGraphQlObjectsUsingIntrospection(
    "SkylarkImage",
    airtable.images,
    metadataAvailability,
    true
  );
  metadata.themes = await createOrUpdateGraphQlObjectsUsingIntrospection(
    "Theme",
    airtable.themes,
    metadataAvailability
  );
  metadata.genres = await createOrUpdateGraphQlObjectsUsingIntrospection(
    "Genre",
    airtable.genres,
    metadataAvailability
  );
  metadata.ratings = await createOrUpdateGraphQlObjectsUsingIntrospection(
    "Rating",
    airtable.ratings,
    metadataAvailability
  );
  metadata.tags = await createOrUpdateGraphQlObjectsUsingIntrospection(
    "SkylarkTag",
    airtable.tags,
    metadataAvailability
  );
  metadata.people = await createOrUpdateGraphQlObjectsUsingIntrospection(
    "Person",
    airtable.people,
    metadataAvailability
  );
  metadata.roles = await createOrUpdateGraphQlObjectsUsingIntrospection(
    "Role",
    airtable.roles,
    metadataAvailability
  );
  metadata.credits = await createOrUpdateGraphQLCredits(
    airtable.credits,
    metadata
  );

  // eslint-disable-next-line no-console
  console.log("Metadata objects created");

  const mediaObjects = await createGraphQLMediaObjects(
    airtable.mediaObjects,
    metadata,
    airtable.dimensions.languages
  );

  await createTranslationsForGraphQLObjects(
    mediaObjects,
    airtable.translations.mediaObjects,
    airtable.dimensions.languages
  );

  // eslint-disable-next-line no-console
  console.log("Media objects created");

  const createdSets: GraphQLBaseObject[] = [];
  if (shouldCreateAdditionalObjects) {
    // SLX Demos have a special sets file
    const setsToCreate =
      contentTypeToIngest === "slxdemos"
        ? slxDemoSetsToCreate
        : orderedSetsToCreate;

    for (let i = 0; i < setsToCreate.length; i += 1) {
      const setConfig = setsToCreate[i];
      // eslint-disable-next-line no-await-in-loop
      const set = await createOrUpdateGraphQLSet(
        setConfig,
        [...mediaObjects, ...createdSets],
        metadata,
        airtable.dimensions.languages,
        airtable.setsMetadata
      );
      if (set) createdSets.push(set);
    }

    // eslint-disable-next-line no-console
    console.log("Additional objects created");
  }

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

  await mkdir("./outputs", { recursive: true });
  await writeFile(
    `./outputs/${dateStamp}.json`,
    JSON.stringify(output, null, 4)
  );

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
