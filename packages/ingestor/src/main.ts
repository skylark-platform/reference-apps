// Import dotenv must be first
import "./env";
import axios from "axios";
import { has } from "lodash";
import { hasProperty } from "@skylark-apps/skylarktv/src/lib/utils";
import { SAAS_API_ENDPOINT } from "@skylark-apps/skylarktv/src/lib/skylark";
import { getAllTables } from "./lib/airtable";
import {
  Airtables,
  GraphQLBaseObject,
  GraphQLMetadata,
} from "./lib/interfaces";
import { CREATE_ONLY, UNLICENSED_BY_DEFAULT } from "./lib/constants";
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
import { updateSkylarkSchema } from "./lib/skylark/saas/schema";
import {
  clearUnableToFindVersionNoneObjectsFile,
  writeAirtableOutputFile,
} from "./lib/skylark/saas/fs";
import { updateObjectConfigurations } from "./lib/skylark/saas/objectConfiguration";
import { configureCache, purgeCache } from "./lib/skylark/saas/cache";
import { guessObjectRelationshipsFromAirtableRows } from "./lib/skylark/saas/utils";
import { updateRelationshipConfigurations } from "./lib/skylark/saas/relationshipConfiguration";

const timers = {
  full: "Completed in:",
  objects: "Objects created in:",
  sets: "Sets created in:",
  configuration: "Schema & configuration updated in:",
};

const createMetadataObjectsWithoutRelationships = async (
  airtable: Airtables,
  metadataAvailability: GraphQLMetadata["availability"],
  metadataAvailabilityWithoutDefault: GraphQLMetadata["availability"],
): Promise<
  Omit<GraphQLMetadata, "dimensions" | "credits" | "availability">
> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const call_to_actions =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "CallToAction",
      airtable.callToActions,
      metadataAvailability,
    );
  const images =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "SkylarkImage",
      airtable.images,
      metadataAvailability,
      { isImage: true },
    );
  const themes =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "Theme",
      airtable.themes,
      metadataAvailability,
    );
  const genres =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "Genre",
      airtable.genres,
      metadataAvailability,
    );
  const ratings =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "Rating",
      airtable.ratings,
      metadataAvailability,
    );
  const tags = await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
    "SkylarkTag",
    airtable.tags,
    metadataAvailability,
  );
  const people =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "Person",
      airtable.people,
      metadataAvailabilityWithoutDefault,
    );
  const roles =
    await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
      "Role",
      airtable.roles,
      metadataAvailabilityWithoutDefault,
    );

  const metadataObjects = await Promise.all([
    call_to_actions,
    images,
    themes,
    genres,
    ratings,
    tags,
    people,
    roles,
  ]);

  return {
    call_to_actions: metadataObjects[0],
    images: metadataObjects[1],
    themes: metadataObjects[2],
    genres: metadataObjects[3],
    ratings: metadataObjects[4],
    tags: metadataObjects[5],
    people: metadataObjects[6],
    roles: metadataObjects[7],
  };
};

const createTranslationsForMetadataObjects = (
  airtable: Airtables,
  metadata: GraphQLMetadata,
) => {
  const callToActionTranslations = createTranslationsForGraphQLObjects(
    metadata.call_to_actions,
    airtable.translations.callToActions,
    airtable.languages,
  );

  const themeTranslations = createTranslationsForGraphQLObjects(
    metadata.themes,
    airtable.translations.themes,
    airtable.languages,
  );

  const genreTranslations = createTranslationsForGraphQLObjects(
    metadata.genres,
    airtable.translations.genres,
    airtable.languages,
  );

  const roleTranslations = createTranslationsForGraphQLObjects(
    metadata.roles,
    airtable.translations.roles,
    airtable.languages,
  );

  const peopleTranslations = createTranslationsForGraphQLObjects(
    metadata.people,
    airtable.translations.people,
    airtable.languages,
  );

  const creditTranslations = createTranslationsForGraphQLObjects(
    metadata.credits,
    airtable.translations.credits,
    airtable.languages,
  );

  return Promise.all([
    callToActionTranslations,
    themeTranslations,
    genreTranslations,
    roleTranslations,
    peopleTranslations,
    creditTranslations,
  ]);
};

const main = async () => {
  await clearUnableToFindVersionNoneObjectsFile();

  // eslint-disable-next-line no-console
  console.time(timers.full);

  const skylarktvSetupOnly = process.env.SKYLARKTV_SETUP_ONLY === "true";
  const shouldCreateAdditionalSkylarkTVObjects =
    !skylarktvSetupOnly && process.env.CREATE_SETS === "true";
  const shouldCreateAdditionalSLXDemoObjects =
    !skylarktvSetupOnly && process.env.CREATE_SLX_DEMO_SETS === "true";
  if (skylarktvSetupOnly)
    // eslint-disable-next-line no-console
    console.log(
      `SkylarkTV setup only mode\n- Schema updates, object configuration updates, dimensions, dimension values & availabilities`,
    );
  // eslint-disable-next-line no-console
  console.log(
    `Additional SkylarkTV sets / dynamic objects creation ${
      shouldCreateAdditionalSkylarkTVObjects ? "enabled" : "disabled"
    }`,
  );
  // eslint-disable-next-line no-console
  console.log(
    `Additional SLX Demo sets / dynamic objects creation ${
      shouldCreateAdditionalSLXDemoObjects ? "enabled" : "disabled"
    }`,
  );
  if (CREATE_ONLY) {
    // eslint-disable-next-line no-console
    console.log(
      "CREATE_ONLY mode enabled, minimal object updates only (partially supported)",
    );
  }

  // eslint-disable-next-line no-console
  const airtable = await getAllTables();

  // eslint-disable-next-line no-console
  console.log(`Starting ingest to Skylark X: ${SAAS_API_ENDPOINT}`);
  // eslint-disable-next-line no-console
  console.time(timers.configuration);

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

  await updateObjectConfigurations();
  // eslint-disable-next-line no-console
  console.log("Object configuration updated");

  await updateRelationshipConfigurations();
  // eslint-disable-next-line no-console
  console.log("Relationship configuration updated");

  if (
    SAAS_API_ENDPOINT === "https://api.showcase.skylarkplatform.com/graphql"
  ) {
    await configureCache();
    // eslint-disable-next-line no-console
    console.log("Cache configuration updated");
  }

  // eslint-disable-next-line no-console
  console.timeEnd(timers.configuration);

  // eslint-disable-next-line no-console
  console.time(timers.objects);

  await purgeCache();

  await createDimensions(showcaseDimensionsConfig);

  const dimensions = await createOrUpdateScheduleDimensionValues(
    airtable.dimensions,
  );

  await createOrUpdateAvailability(airtable.availability, dimensions);

  if (!skylarktvSetupOnly) {
    const defaultSchedule = airtable.availability.find(
      ({ fields }) =>
        has(fields, "default") && fields.default && has(fields, "slug"),
    );

    // eslint-disable-next-line no-console
    console.log(
      `Default license: ${
        UNLICENSED_BY_DEFAULT || !defaultSchedule
          ? "undefined"
          : `${defaultSchedule?.fields.slug as string} (${defaultSchedule.id})`
      }`,
    );

    const metadataAvailability: GraphQLMetadata["availability"] = {
      // We use the Airtable IDs (external_id within Skylark) for Availability
      all: airtable.availability.map(({ id }) => id),
      // default: UNLICENSED_BY_DEFAULT ? undefined : defaultSchedule?.id,
      default: undefined,
    };

    // Use when the relationship uses availability inheritance
    const metadataAvailabilityWithoutDefault: GraphQLMetadata["availability"] =
      {
        all: airtable.availability.map(({ id }) => id),
      };

    const metadataWithoutRelationships =
      await createMetadataObjectsWithoutRelationships(
        airtable,
        metadataAvailability,
        metadataAvailabilityWithoutDefault,
      );

    const metadata: GraphQLMetadata = {
      dimensions,
      availability: metadataAvailability,
      credits: [],
      ...metadataWithoutRelationships,
    };

    metadata.credits = await createOrUpdateGraphQLCredits(airtable.credits, {
      ...metadata,
      availability: metadataAvailabilityWithoutDefault,
    });

    await createTranslationsForMetadataObjects(airtable, metadata);

    // eslint-disable-next-line no-console
    console.log("Metadata objects created");

    const mediaObjects = await createGraphQLMediaObjects(
      airtable.mediaObjects.filter(
        ({ fields }) => fields.skylark_object_type !== "SkylarkSet",
      ),
      metadata,
      airtable.languages,
    );

    const articles =
      await createOrUpdateGraphQlObjectsFromAirtableUsingIntrospection(
        "Article",
        airtable.articles,
        metadataAvailabilityWithoutDefault,
        {
          relationships: guessObjectRelationshipsFromAirtableRows(
            ["images", "tags", "credits"],
            airtable.articles,
            metadata,
          ),
        },
      );

    await createTranslationsForGraphQLObjects(
      articles,
      airtable.translations.articles,
      airtable.languages,
    );

    // eslint-disable-next-line no-console
    console.log("Media objects created");

    const createdSets: GraphQLBaseObject[] = [];
    if (shouldCreateAdditionalSkylarkTVObjects) {
      // eslint-disable-next-line no-console
      console.time(timers.sets);

      const setMediaObjects = airtable.mediaObjects.filter(
        ({ fields }) => fields.skylark_object_type === "SkylarkSet",
      );
      const mediaObjectTableSets = Object.fromEntries(
        setMediaObjects.map(({ id, fields }) => [
          id,
          fields.skylarkset_external_id as string,
        ]),
      );

      const sets = airtable.sets.sort((a, b) =>
        ((a.fields.creation_order as number) || 0) >
        ((b.fields.creation_order as number) || 0)
          ? 1
          : -1,
      );
      for (let i = 0; i < sets.length; i += 1) {
        const setConfig = sets[i];
        // eslint-disable-next-line no-await-in-loop
        const set = await createOrUpdateGraphQLSet(
          setConfig,
          [...mediaObjects, ...createdSets],
          metadata,
          airtable.languages,
          airtable.setsMetadata,
          mediaObjectTableSets,
        );
        if (set) createdSets.push(set);
      }

      // eslint-disable-next-line no-console
      console.log("Additional SkylarkTV objects created");
      // eslint-disable-next-line no-console
      console.timeEnd(timers.sets);
    }

    await createTranslationsForGraphQLObjects(
      mediaObjects,
      airtable.translations.mediaObjects,
      airtable.languages,
    );

    // eslint-disable-next-line no-console
    console.log("Media object translations created");

    // eslint-disable-next-line no-console
    console.timeEnd(timers.objects);

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

    await purgeCache();
  }

  // eslint-disable-next-line no-console
  console.timeEnd(timers.full);
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
