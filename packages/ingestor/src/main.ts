// Import dotenv must be first
import "./env";
import Amplify from "@aws-amplify/core";
import {
  amplifyConfig,
  ApiEntertainmentObject,
  ApiPerson,
  ApiRole,
} from "@skylark-reference-apps/lib";
import {
  COGNITO_REGION,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
} from "./lib/constants";
import { signInToCognito } from "./lib/cognito";
import {
  getAlwaysSchedule,
  getImageTypes,
  getSetTypes,
  createOrUpdateDynamicObject,
  createObjectsInSkylark,
  createOrUpdateSetAndContents,
  createOrUpdateObject,
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

const config = amplifyConfig({
  region: COGNITO_REGION,
  userPoolId: COGNITO_USER_POOL_ID,
  userPoolWebClientId: COGNITO_USER_POOL_CLIENT_ID,
});

Amplify.configure(config);

const createMetadata = async (airtable: Airtables): Promise<Metadata> => {
  const alwaysSchedule = await getAlwaysSchedule();
  const imageTypes = await getImageTypes();
  const setTypes = await getSetTypes();

  const metadata: Metadata = {
    schedules: {
      always: alwaysSchedule,
    },
    imageTypes,
    people: [],
    roles: [],
    airtableCredits: airtable.credits,
    set: {
      types: setTypes,
      metadata: airtable.setsMetadata.map(({ fields }) => fields),
    },
  };

  const roles = await Promise.all(
    airtable.roles.map(async ({ fields, id }) => {
      const title = fields.title as string;
      const roleData: Partial<ApiRole> = {
        title,
        schedule_urls: [metadata.schedules.always.self],
      };
      const role = await createOrUpdateObject<ApiRole>(
        "roles",
        { property: "title", value: title },
        roleData,
        "PUT"
      );
      return {
        ...role,
        airtableId: id,
      };
    })
  );
  metadata.roles = roles;

  const people = await createObjectsInSkylark<ApiPerson>(
    "people",
    airtable.people,
    metadata
  );
  metadata.people = people;

  // eslint-disable-next-line no-console
  console.log("Metadata objects created");

  return metadata;
};

const createMediaObjects = async (airtable: Airtables, metadata: Metadata) => {
  const brands = await createObjectsInSkylark<ApiEntertainmentObject>(
    "brands",
    airtable.brands,
    metadata
  );
  const seasons = await createObjectsInSkylark<ApiEntertainmentObject>(
    "seasons",
    airtable.seasons,
    metadata,
    brands
  );
  await createObjectsInSkylark<ApiEntertainmentObject>(
    "episodes",
    airtable.episodes,
    metadata,
    seasons
  );
  await createObjectsInSkylark<ApiEntertainmentObject>(
    "movies",
    airtable.movies,
    metadata
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

  console.log("clean");
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Error while ingesting to Skylark");
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
