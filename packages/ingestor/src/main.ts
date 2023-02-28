// Import dotenv must be first
import "./env";
import {
  ApiAssetType,
  ApiImageType,
  ApiPerson,
  ApiRating,
  ApiRole,
  ApiSetType,
  ApiTag,
  ApiTagCategory,
  ApiThemeGenre,
  SKYLARK_API,
  SAAS_API_ENDPOINT,
} from "@skylark-reference-apps/lib";
import axios from "axios";
import { Attachment } from "airtable";
import { mkdir, writeFile } from "fs/promises";
import { has } from "lodash";
import {
  createOrUpdateDynamicObject,
  createOrUpdateSetAndContents,
  createOrUpdateAirtableObjectsInSkylark,
  getResources,
  createOrUpdateAirtableObjectsInSkylarkWithParentsInSameTable,
  createTranslationsForObjects,
  connectExternallyCreatedAssetToMediaObject,
  createOrUpdateSchedules,
  createOrUpdateScheduleDimensions,
  getAlwaysSchedule,
  createOrUpdateContentTypes,
} from "./lib/skylark/classic";
import { getAllTables } from "./lib/airtable";
import {
  Airtables,
  ApiEntertainmentObjectWithAirtableId,
  GraphQLBaseObject,
  GraphQLMetadata,
  Metadata,
} from "./lib/interfaces";
import {
  orderedSetsToCreate,
  orderedSetsToCreateWithoutDynamicObject,
} from "./additional-objects/sets";
import { quentinTarantinoMovies } from "./additional-objects/dynamicObjects";
import {
  configureAmplify,
  signInToCognito,
  uploadToWorkflowServiceWatchBucket,
} from "./lib/amplify";
import {
  CHECK_MISSING,
  CREATE_ONLY,
  UNLICENSED_BY_DEFAULT,
} from "./lib/constants";
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

const createMetadata = async (airtable: Airtables): Promise<Metadata> => {
  const [alwaysSchedule, setTypes, dimensions] = await Promise.all([
    getAlwaysSchedule(),
    getResources<ApiSetType>("set-types"),
    createOrUpdateScheduleDimensions(airtable.dimensions),
  ]);
  const createdSchedules = await createOrUpdateSchedules(
    airtable.availability,
    dimensions
  );
  // eslint-disable-next-line no-console
  console.log("Schedule objects created");
  // eslint-disable-next-line no-console
  console.log(
    `Default license: ${
      UNLICENSED_BY_DEFAULT
        ? "undefined"
        : `${alwaysSchedule.title} (${alwaysSchedule.self})`
    }`
  );

  const metadata: Metadata = {
    schedules: {
      default: UNLICENSED_BY_DEFAULT ? undefined : alwaysSchedule,
      always: alwaysSchedule,
      all: createdSchedules,
    },
    imageTypes: [],
    assetTypes: [],
    tagTypes: [],
    people: [],
    roles: [],
    genres: [],
    themes: [],
    ratings: [],
    tags: [],
    airtableCredits: airtable.credits,
    airtableImages: airtable.images,
    set: {
      types: setTypes,
      additionalRecords: airtable.setsMetadata,
    },
    dimensions,
  };

  metadata.assetTypes = await createOrUpdateContentTypes<ApiAssetType>(
    "asset-types",
    airtable.assetTypes,
    metadata
  );

  metadata.imageTypes = await createOrUpdateContentTypes<ApiImageType>(
    "image-types",
    airtable.imageTypes,
    metadata
  );

  metadata.tagTypes = await createOrUpdateContentTypes<ApiTagCategory>(
    "tag-categories",
    airtable.tagTypes,
    metadata
  );

  metadata.roles = await createOrUpdateAirtableObjectsInSkylark<ApiRole>(
    airtable.roles,
    metadata
  );

  metadata.people = await createOrUpdateAirtableObjectsInSkylark<ApiPerson>(
    airtable.people,
    metadata
  );

  metadata.genres = await createOrUpdateAirtableObjectsInSkylark<ApiThemeGenre>(
    airtable.genres,
    metadata
  );

  metadata.themes = await createOrUpdateAirtableObjectsInSkylark<ApiThemeGenre>(
    airtable.themes,
    metadata
  );

  metadata.ratings = await createOrUpdateAirtableObjectsInSkylark<ApiRating>(
    airtable.ratings,
    metadata
  );

  metadata.tags = await createOrUpdateAirtableObjectsInSkylark<ApiTag>(
    airtable.tags,
    metadata
  );

  // eslint-disable-next-line no-console
  console.log("Metadata objects created");
  return metadata;
};

const createMediaObjects = async (airtable: Airtables, metadata: Metadata) => {
  const mediaObjects =
    await createOrUpdateAirtableObjectsInSkylarkWithParentsInSameTable(
      airtable.mediaObjects,
      metadata
    );

  // eslint-disable-next-line no-console
  console.log("Media objects created");

  await connectExternallyCreatedAssetToMediaObject(
    airtable.mediaObjects,
    mediaObjects,
    metadata
  );

  // eslint-disable-next-line no-console
  console.log("Media objects linked to external assets");

  await createTranslationsForObjects(
    mediaObjects,
    airtable.translations.mediaObjects,
    metadata
  );

  // eslint-disable-next-line no-console
  console.log("Media objects translated");

  return mediaObjects;
};

const createAndUploadAssets = async (
  table: Airtables["mediaObjects"],
  mediaObjects: ApiEntertainmentObjectWithAirtableId[]
) => {
  const assets = mediaObjects.filter((obj) =>
    obj.self.startsWith("/api/assets/")
  );

  await Promise.all(
    assets.map(async (asset) => {
      const airtableAsset = table.find(
        (record) => record.id === asset.airtableId
      );
      const files = (airtableAsset?.fields?.file as Attachment[]) || [];
      if (!airtableAsset || files.length === 0) {
        return;
      }
      const [file] = files;
      const response = await axios.get<string>(file.url, {
        responseType: "arraybuffer",
        decompress: false,
      });

      await uploadToWorkflowServiceWatchBucket(
        file.filename,
        response.data,
        asset.uid
      );
    })
  );

  // eslint-disable-next-line no-console
  console.log("Assets uploaded to S3");
};

const createAdditionalObjects = async (metadata: Metadata) => {
  await createOrUpdateDynamicObject(quentinTarantinoMovies, metadata);

  // eslint-disable-next-line no-restricted-syntax
  for (const set of orderedSetsToCreate) {
    // eslint-disable-next-line no-await-in-loop
    await createOrUpdateSetAndContents(set, metadata);
  }

  // eslint-disable-next-line no-console
  console.log("Additional objects created");
};

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

  if (process.env.INGEST_TO_SAAS_SKYLARK === "true") {
    // eslint-disable-next-line no-console
    console.log(`Starting ingest to SaaS Skylark: ${SAAS_API_ENDPOINT}`);

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
      "Image",
      airtable.images,
      metadataAvailability
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
      "Tag",
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
      metadata
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
          : orderedSetsToCreateWithoutDynamicObject;

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
  } else {
    // eslint-disable-next-line no-console
    console.log(`Starting ingest to V8 Skylark: ${SKYLARK_API}`);
    if (CHECK_MISSING)
      // eslint-disable-next-line no-console
      console.log("CHECK_MISSING mode ENABLED (will not create or update)");
    if (CREATE_ONLY)
      // eslint-disable-next-line no-console
      console.log("CREATE_ONLY mode ENABLED (will not create or update)");

    configureAmplify();

    await signInToCognito();

    const metadata = await createMetadata(airtable);

    const mediaObjects = await createMediaObjects(airtable, metadata);

    if (shouldCreateAdditionalObjects) {
      await createAdditionalObjects(metadata);
    }

    await createAndUploadAssets(airtable.mediaObjects, mediaObjects);
  }

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
