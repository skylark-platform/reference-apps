// Import dotenv must be first
import "./env";
import Amplify from "@aws-amplify/core";
import {
  amplifyConfig,
  ApiAssetType,
  ApiEntertainmentObject,
  ApiImageType,
  ApiPerson,
  ApiRating,
  ApiRole,
  ApiSetType,
  ApiThemeGenre,
} from "@skylark-reference-apps/lib";
import {
  COGNITO_REGION,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
} from "./lib/constants";
import { signInToCognito } from "./lib/cognito";
import {
  createOrUpdateDynamicObject,
  createOrUpdateSetAndContents,
  createOrUpdateAirtableObjectsInSkylarkBySlug,
  createOrUpdateAirtableObjectsInSkylarkByTitle,
  getResources,
} from "./lib/skylark";
import { getAllTables } from "./lib/airtable";
import { Airtables, Metadata } from "./interfaces";
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

const config = amplifyConfig({
  region: COGNITO_REGION,
  userPoolId: COGNITO_USER_POOL_ID,
  userPoolWebClientId: COGNITO_USER_POOL_CLIENT_ID,
});

Amplify.configure(config);

const createMetadata = async (airtable: Airtables): Promise<Metadata> => {
  const [alwaysSchedule, imageTypes, setTypes, dimensions] = await Promise.all([
    getAlwaysSchedule(),
    getResources<ApiImageType>("image-types"),
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
    imageTypes,
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

  metadata.assetTypes =
    await createOrUpdateAirtableObjectsInSkylarkBySlug<ApiAssetType>(
      "asset-types",
      airtable.assetTypes,
      metadata
    );

  metadata.roles = await createOrUpdateAirtableObjectsInSkylarkByTitle<ApiRole>(
    "roles",
    airtable.roles,
    metadata
  );

  metadata.people =
    await createOrUpdateAirtableObjectsInSkylarkBySlug<ApiPerson>(
      "people",
      airtable.people,
      metadata
    );

  metadata.genres =
    await createOrUpdateAirtableObjectsInSkylarkBySlug<ApiThemeGenre>(
      "genres",
      airtable.genres,
      metadata
    );

  metadata.themes =
    await createOrUpdateAirtableObjectsInSkylarkBySlug<ApiThemeGenre>(
      "themes",
      airtable.themes,
      metadata
    );

  metadata.ratings =
    await createOrUpdateAirtableObjectsInSkylarkBySlug<ApiRating>(
      "ratings",
      airtable.ratings,
      metadata
    );

  // eslint-disable-next-line no-console
  console.log("Metadata objects created");
  return metadata;
};

const createMediaObjects = async (airtable: Airtables, metadata: Metadata) => {
  const brands =
    await createOrUpdateAirtableObjectsInSkylarkBySlug<ApiEntertainmentObject>(
      "brands",
      airtable.brands,
      metadata
    );
  const seasons =
    await createOrUpdateAirtableObjectsInSkylarkBySlug<ApiEntertainmentObject>(
      "seasons",
      airtable.seasons,
      metadata,
      brands
    );
  await createOrUpdateAirtableObjectsInSkylarkBySlug<ApiEntertainmentObject>(
    "episodes",
    airtable.episodes,
    metadata,
    [...seasons, ...brands]
  );
  await createOrUpdateAirtableObjectsInSkylarkBySlug<ApiEntertainmentObject>(
    "movies",
    airtable.movies,
    metadata,
    brands
  );

  // eslint-disable-next-line no-console
  console.log("Media objects created");
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
  await signInToCognito();

  const airtable = await getAllTables();

  const metadata = await createMetadata(airtable);

  await createMediaObjects(airtable, metadata);

  await createAdditionalObjects(metadata);

  // eslint-disable-next-line no-console
  console.log("great success");
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Error while ingesting to Skylark");
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
