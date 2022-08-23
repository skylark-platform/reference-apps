// Import dotenv must be first
import "./env";
import {
  ApiAssetType,
  ApiImageType,
  ApiPerson,
  ApiRating,
  ApiRole,
  ApiSetType,
  ApiThemeGenre,
} from "@skylark-reference-apps/lib";
import axios from "axios";
import { Attachment } from "airtable";
import {
  createOrUpdateDynamicObject,
  createOrUpdateSetAndContents,
  createOrUpdateAirtableObjectsInSkylark,
  getResources,
  createOrUpdateAirtableObjectsInSkylarkWithParentsInSameTable,
  createTranslationsForObjects,
} from "./lib/skylark";
import { getAllTables } from "./lib/airtable";
import {
  Airtables,
  ApiEntertainmentObjectWithAirtableId,
  Metadata,
} from "./interfaces";
import {
  spotlightMovies,
  homePageSlider,
  mediaReferenceHomepage,
  discoverCollection,
  tarantinoMoviesCollection,
} from "./additional-objects/sets";
import { quentinTarantinoMovies } from "./additional-objects/dynamicObjects";
import {
  createOrUpdateSchedules,
  createOrUpdateScheduleDimensions,
  getAlwaysSchedule,
} from "./lib/skylark/availability";
import { createOrUpdateContentTypes } from "./lib/skylark/content-types";
import {
  configureAmplify,
  signInToCognito,
  uploadToWorkflowServiceWatchBucket,
} from "./lib/amplify";

const createMetadata = async (airtable: Airtables): Promise<Metadata> => {
  const [alwaysSchedule, setTypes, dimensions] = await Promise.all([
    getAlwaysSchedule(),
    getResources<ApiSetType>("set-types"),
    createOrUpdateScheduleDimensions(airtable.dimensions),
  ]);
  const createdSchedules = await createOrUpdateSchedules(
    airtable.availibility,
    dimensions
  );
  // eslint-disable-next-line no-console
  console.log("Schedule objects created");

  const metadata: Metadata = {
    schedules: {
      default: alwaysSchedule,
      all: createdSchedules,
    },
    imageTypes: [],
    assetTypes: [],
    people: [],
    roles: [],
    genres: [],
    themes: [],
    ratings: [],
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

  await createTranslationsForObjects(
    mediaObjects,
    airtable.translations.mediaObjects,
    metadata
  );

  // eslint-disable-next-line no-console
  console.log("Media objects created");

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

  // Upload asset to S3 with the id in the metadata

  // eslint-disable-next-line no-console
  console.log("Assets uploaded to S3");
};

const createAdditionalObjects = async (metadata: Metadata) => {
  await createOrUpdateDynamicObject(quentinTarantinoMovies, metadata);

  await createOrUpdateSetAndContents(spotlightMovies, metadata);
  await createOrUpdateSetAndContents(homePageSlider, metadata);
  await createOrUpdateSetAndContents(tarantinoMoviesCollection, metadata);
  // discoverCollection needs the tarantinoMoviesCollection
  await createOrUpdateSetAndContents(discoverCollection, metadata);
  // Order matters, homepage is last as it includes the rail and slider
  await createOrUpdateSetAndContents(mediaReferenceHomepage, metadata);

  // eslint-disable-next-line no-console
  console.log("Additional objects created");
};

const main = async () => {
  configureAmplify();

  await signInToCognito();

  const airtable = await getAllTables();

  const metadata = await createMetadata(airtable);

  const mediaObjects = await createMediaObjects(airtable, metadata);

  await createAndUploadAssets(airtable.mediaObjects, mediaObjects);

  await createAdditionalObjects(metadata);

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
