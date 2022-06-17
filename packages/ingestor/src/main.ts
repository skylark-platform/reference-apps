// Import dotenv must be first
import "./env";
import Amplify from "@aws-amplify/core";
import {
  amplifyConfig,
  ApiBaseObject,
  ApiCreditUnexpanded,
  ApiEntertainmentObject,
  ApiPerson,
  ApiRole,
} from "@skylark-reference-apps/lib";
import { FieldSet, Record, Records } from "airtable";
import {
  COGNITO_REGION,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
} from "./constants";
import { signInToCognito } from "./cognito";
import {
  createOrUpdateObject,
  getAlwaysSchedule,
  getImageTypes,
  getSetTypes,
  createOrUpdateRole,
  createDynamicObject,
} from "./api/skylark";
import { getAllTables } from "./api/airtable";
import { ApiObjectType, Metadata } from "./interfaces";
import {
  spotlightMovies,
  homePageSlider,
  mediaReferenceHomepage,
  discoverCollection,
  tarantinoMoviesCollection,
} from "./additional-objects/sets";
import { quentinTarantinoMovies } from "./additional-objects/dynamicObjects";
import {
  createOrUpdateSetAndContents,
  parseAirtableImagesAndUploadToSkylark,
} from "./utils";

interface ApiEntertainmentObjectWithAirtableId extends ApiEntertainmentObject {
  airtableId: string;
}

const config = amplifyConfig({
  region: COGNITO_REGION,
  userPoolId: COGNITO_USER_POOL_ID,
  userPoolWebClientId: COGNITO_USER_POOL_CLIENT_ID,
});

Amplify.configure(config);

const getPeopleAndRoleUrlsFromCredit = (
  { fields: credit }: Record<FieldSet>,
  people: (ApiPerson & { airtableId: string })[],
  roles: (ApiRole & { airtableId: string })[]
): ApiCreditUnexpanded | null => {
  const person = people.find(
    (p) => p.airtableId === (credit.person as string[])[0]
  );
  const role = roles.find((r) => r.airtableId === (credit.role as string[])[0]);
  if (person && role) {
    return {
      people_url: person?.self,
      role_url: role?.self,
    };
  }
  return null;
};

const createObjectsInSkylark = <T extends ApiBaseObject>(
  type: ApiObjectType,
  airtableRecords: Records<FieldSet>,
  metadata: Metadata,
  parents?: ApiEntertainmentObjectWithAirtableId[]
) => {
  const promises: Promise<T & { airtableId: string }>[] = airtableRecords.map(
    async ({ fields, id }): Promise<T & { airtableId: string }> => {
      const parentObject = parents?.find(
        ({ airtableId }) =>
          fields.parent && (fields.parent as string[])[0] === airtableId
      );

      const object = {
        uid: "",
        self: "",
        name: fields?.name as string,
        title: fields?.title as string,
        slug: fields?.slug as string,
        title_short: fields?.title_short as string,
        title_medium: fields?.title_medium as string,
        title_long: fields?.title_long as string,
        synopsis_short: fields?.synopsis_short as string,
        synopsis_medium: fields?.synopsis_medium as string,
        synopsis_long: fields?.synopsis_long as string,
        release_date: fields?.release_date as string,
        parent_url: parentObject?.self,
        schedule_urls: [metadata.schedules.always.self],
        season_number: fields?.season_number as number,
        number_of_episodes: fields?.number_of_episodes as number,
        episode_number: fields?.episode_number as number,
        credits: [] as ApiCreditUnexpanded[],
      };

      if (fields.credits) {
        const credits = (fields.credits as string[]).map((creditId) =>
          metadata.airtableCredits.find(
            ({ id: airtableCreditId }) => airtableCreditId === creditId
          )
        );
        const apiCredits = credits
          .map(
            (credit) =>
              credit &&
              getPeopleAndRoleUrlsFromCredit(
                credit,
                metadata.people,
                metadata.roles
              )
          )
          .filter((credit) => !!credit) as ApiCreditUnexpanded[];
        object.credits = apiCredits;
      }

      const createdObject = await createOrUpdateObject<T>(type, object);

      const imageUrls = await parseAirtableImagesAndUploadToSkylark<T>(
        fields,
        createdObject,
        metadata
      );

      return {
        ...createdObject,
        airtableId: id,
        image_urls: imageUrls,
      };
    }
  );

  return Promise.all(promises);
};

const main = async () => {
  await signInToCognito();

  const alwaysSchedule = await getAlwaysSchedule();
  const imageTypes = await getImageTypes();
  const setTypes = await getSetTypes();

  const airtable = await getAllTables();

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
      const role = await createOrUpdateRole(fields.title as string, [
        metadata.schedules.always.self,
      ]);
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

  await createDynamicObject(quentinTarantinoMovies, metadata);

  await createOrUpdateSetAndContents(spotlightMovies, metadata);
  await createOrUpdateSetAndContents(homePageSlider, metadata);
  await createOrUpdateSetAndContents(tarantinoMoviesCollection, metadata);
  // discoverCollection needs the tarantinoMoviesCollection
  await createOrUpdateSetAndContents(discoverCollection, metadata);
  // Order matters, homepage is last as it includes the rail and slider
  await createOrUpdateSetAndContents(mediaReferenceHomepage, metadata);

  console.log("clean");
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Error while ingesting to Skylark");
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
