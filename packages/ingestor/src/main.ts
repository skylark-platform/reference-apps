// Import dotenv must be first
import "./env";
import Amplify from "@aws-amplify/core";
import { amplifyConfig, ApiEntertainmentObject, ApiImageType, ApiSchedule, ApiSetType } from "@skylark-reference-apps/lib"
import { Attachment, FieldSet, Records } from "airtable";
import { COGNITO_REGION, COGNITO_USER_POOL_CLIENT_ID, COGNITO_USER_POOL_ID } from "./constants";
import { signInToCognito } from "./cognito";
import { createOrUpdateEntertainmentObject, getAlwaysSchedule, ApiEntertainmentObjectType, getImageTypes, createImage, getSetTypes } from "./api/skylark";
import { getBrandsTable, getEpisodesTable, getMoviesTable, getSeasonsTable } from "./api/airtable";

interface ApiEntertainmentObjectWithAirtableId extends ApiEntertainmentObject {
  airtableId: string;
}

interface Metadata {
  schedules: {
    always: ApiSchedule
  };
  imageTypes: ApiImageType[]
  setTypes: ApiSetType[]
}

const config = amplifyConfig({
  region: COGNITO_REGION,
  userPoolId: COGNITO_USER_POOL_ID,
  userPoolWebClientId: COGNITO_USER_POOL_CLIENT_ID,
});

Amplify.configure(config);

const createEntertainmentObjectsInSkylark = (type: ApiEntertainmentObjectType, airtableRecords: Records<FieldSet>, metadata: Metadata, parents?: ApiEntertainmentObjectWithAirtableId[]) => {
  const promises = airtableRecords.map(async({ fields, id }): Promise<ApiEntertainmentObjectWithAirtableId> => {
    const parentObject = parents?.find(({ airtableId }) => fields.parent && (fields.parent as string[])[0] === airtableId);
    const object: ApiEntertainmentObject = {
      uid: "",
      self: "",
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
    }

    if(type === "seasons") {
      object.season_number = fields?.season_number as number
      object.number_of_episodes = fields?.number_of_episodes as number
    }

    if(type === "episodes") {
      object.episode_number = fields?.episode_number as number
    }

    const createdObject = await createOrUpdateEntertainmentObject(type, object);

    const imageUrls = await Promise.all(Object.keys(fields).filter((key) => key.startsWith("image__")).map((key) => {
      const [airtableImage] = fields[key] as Attachment[];
      const imageSlug = key.replace("image__", "");
      const imageType = metadata.imageTypes.find(({ slug }) => slug === imageSlug);
      if (!imageType) {
        throw new Error(`Invalid image type ${imageSlug} (${key})`);
      }
      return createImage(airtableImage.filename, airtableImage.url, createdObject.self, imageType.self, [metadata.schedules.always.self]);
    }));

    return {
      ...createdObject,
      airtableId: id,
      image_urls: imageUrls,
    }
  });

  return Promise.all(promises);
}

const main = async() => {
  await signInToCognito();

  const alwaysSchedule = await getAlwaysSchedule();
  const imageTypes = await getImageTypes();
  const setTypes = await getSetTypes();

  const airtableBrands = await getBrandsTable();
  const airtableSeasons = await getSeasonsTable();
  const airtableEpisodes = await getEpisodesTable();
  const airtableMovies = await getMoviesTable();

  const metadata: Metadata = {
    schedules: {
      always: alwaysSchedule,
    },
    imageTypes,
    setTypes,
  }

  const brands = await createEntertainmentObjectsInSkylark("brands", airtableBrands, metadata);
  const seasons = await createEntertainmentObjectsInSkylark("seasons", airtableSeasons, metadata, brands);
  await createEntertainmentObjectsInSkylark("episodes", airtableEpisodes, metadata, seasons);
  await createEntertainmentObjectsInSkylark("movies", airtableMovies, metadata);


  console.log("clean")
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Error while ingesting to Skylark");
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
