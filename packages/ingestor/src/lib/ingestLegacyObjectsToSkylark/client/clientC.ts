/* eslint-disable no-console */
import dayjs from "dayjs";
import {
  FetchedLegacyObjects,
  LegacyAsset,
  LegacyBrand,
  LegacyEpisode,
  LegacyGenre,
  LegacyImage,
  LegacyObjectType,
  LegacyObjects,
  LegacyPerson,
  LegacyRating,
  LegacyRole,
  LegacySeason,
  LegacySet,
  LegacyTag,
  LegacyTagCategory,
  ParsedSL8Credits,
} from "../types/legacySkylark";

import { createObjectsInSkylark } from "../skylark";
import { ConvertedLegacyObject } from "../types/skylark";

import { clearUnableToFindVersionNoneObjectsFile } from "../../skylark/saas/fs";
import {
  commonSkylarkConfigurationUpdates,
  createEmptySkylarkObjects,
  fetchAndWriteLegacyObjects,
} from "./common";
import { convertSL8CreditsToLegacyObjects } from "../legacy";

import { createSetContent } from "../skylarkRelationships";

interface CustomerCLegacyObjects
  extends Record<string, FetchedLegacyObjects<LegacyObjects[0]>> {
  tagCategories: FetchedLegacyObjects<LegacyTagCategory>;
  tags: FetchedLegacyObjects<LegacyTag>;
  genres: FetchedLegacyObjects<LegacyGenre>;
  ratings: FetchedLegacyObjects<LegacyRating>;
  people: FetchedLegacyObjects<LegacyPerson>;
  roles: FetchedLegacyObjects<LegacyRole>;
  images: FetchedLegacyObjects<LegacyImage>;
  assets: FetchedLegacyObjects<LegacyAsset>;
  episodes: FetchedLegacyObjects<LegacyEpisode>;
  seasons: FetchedLegacyObjects<LegacySeason>;
  brands: FetchedLegacyObjects<LegacyBrand>;
  sets: FetchedLegacyObjects<LegacySet>;
}

const languagesToCheck = ["en-gb"];

const convertLegacyObject = (
  legacyObject: LegacyObjects[0] | ParsedSL8Credits
): ConvertedLegacyObject | null => {
  // eslint-disable-next-line no-underscore-dangle
  const legacyObjectType = legacyObject._type;
  const legacyUid = legacyObject.uid;
  if (!legacyObjectType) {
    throw new Error(
      `[convertLegacyObject] Unknown legacy object type: ${legacyUid}`
    );
  }

  const commonFields = {
    ...legacyObject, // By adding the whole legacy object to each object, the introspection create will add any missing fields that are
    external_id: legacyObject.uid,
    title_sort: legacyObject.data_source_id, // Switch this to External ID when client happy
  };

  if (legacyObjectType === LegacyObjectType.Assets) {
    const assetType = legacyObject.asset_type_url?.name || null;

    return {
      ...commonFields,
      internal_title: legacyObject.title,
      title_short: legacyObject.title_short || null,
      title: legacyObject.title,
      synopsis: legacyObject.synopsis_long || null,
      synopsis_short: legacyObject.synopsis_medium || null,
      type: assetType,
      duration: legacyObject.duration_in_seconds,
      url: legacyObject.url !== "" ? legacyObject.url : null,
      release_date: legacyObject.release_date,
    };
  }

  if (legacyObjectType === LegacyObjectType.Episodes) {
    return {
      ...commonFields,
      internal_title: legacyObject.title,
      title: legacyObject.title_medium || legacyObject.title_long || null,
      title_short: legacyObject.title_short || null,
      synopsis: legacyObject.synopsis_long || null,
      synopsis_short:
        legacyObject.synopsis_medium || legacyObject.synopsis_short || null,
      episode_number: legacyObject.episode_number,
      release_date: legacyObject.release_date || null,
    };
  }

  if (legacyObjectType === LegacyObjectType.Seasons) {
    return {
      ...commonFields,
      internal_title: legacyObject.title,
      title: legacyObject.title_medium || legacyObject.title_long || null,
      title_short: legacyObject.title_short || null,
      synopsis: legacyObject.synopsis_medium || null,
      synopsis_short: legacyObject.synopsis_short || null,
      season_number: legacyObject.season_number,
      number_of_episodes: legacyObject.number_of_episodes,
      release_date: legacyObject.release_date || null,
    };
  }

  if (legacyObjectType === LegacyObjectType.Brands) {
    return {
      ...commonFields,
      internal_title: legacyObject.title,
      title: legacyObject.title_medium || legacyObject.title_long || null,
      title_short: legacyObject.title_short || null,
      synopsis: legacyObject.synopsis_medium || null,
      synopsis_short: legacyObject.synopsis_short || null,
      release_date: legacyObject.release_date || null,
    };
  }

  if (legacyObjectType === LegacyObjectType.Sets) {
    const setType = legacyObject.set_type_slug || null;

    const tLong = legacyObject.title_long;
    const tMed = legacyObject.title_medium;
    const tShort = legacyObject.title_short;
    const title = tLong || tMed;
    const titleShort = tLong ? tMed || tShort : tShort;

    return {
      ...commonFields,
      type: setType,
      internal_title: legacyObject.title,
      title: title || null,
      title_short: titleShort || null,
      synopsis: legacyObject.synopsis_medium || null,
      synopsis_short: legacyObject.synopsis_short || null,
      description: legacyObject.synopsis_long || null,
      release_date: legacyObject.release_date || null,
    };
  }

  if (legacyObjectType === LegacyObjectType.Ratings) {
    return {
      ...commonFields,
      internal_title: legacyObject.title,
      // Handle both potentially valid fields (after a fix)
      schema: legacyObject.scheme,
      scheme: legacyObject.scheme,
    };
  }

  if (legacyObjectType === LegacyObjectType.Images) {
    const imageType = legacyObject.image_type || null;
    return {
      ...commonFields,
      internal_title: legacyObject.title,
      type: imageType,
      external_url: legacyObject.url, // TODO when doing full ingest, change the external_url to be download_from_url so the images are moved across
    };
  }

  if (legacyObjectType === LegacyObjectType.People) {
    return {
      ...commonFields,
      internal_title: legacyObject.name,
      date_of_birth:
        legacyObject.date_of_birth &&
        dayjs(legacyObject.date_of_birth).isValid()
          ? dayjs(legacyObject.date_of_birth).format("YYYY-MM-DD")
          : null,
      place_of_birth: null, // TODO fix this on an env where place_of_birth isn't a date
      // All fields should be handled by the introspection create
    };
  }

  if (
    legacyObjectType === LegacyObjectType.Genres ||
    legacyObjectType === LegacyObjectType.Tags
  ) {
    return {
      ...commonFields,
      internal_title: legacyObject.name,
      // All fields should be handled by the introspection create
    };
  }

  if (legacyObjectType === LegacyObjectType.Roles) {
    return {
      ...commonFields,
      internal_title: legacyObject.title,
      // All fields should be handled by the introspection create
    };
  }

  return commonFields;
};

export const ingestClientC = async ({
  readFromDisk,
  isCreateOnly,
}: {
  readFromDisk: boolean;
  isCreateOnly: boolean;
}) => {
  const objectsToFetch: Record<keyof CustomerCLegacyObjects, LegacyObjectType> =
    {
      tagCategories: LegacyObjectType.TagCategories,
      tags: LegacyObjectType.Tags,
      genres: LegacyObjectType.Genres,
      ratings: LegacyObjectType.Ratings,
      people: LegacyObjectType.People,
      roles: LegacyObjectType.Roles,
      images: LegacyObjectType.Images,
      assets: LegacyObjectType.Assets,
      episodes: LegacyObjectType.Episodes,
      seasons: LegacyObjectType.Seasons,
      brands: LegacyObjectType.Brands,
      sets: LegacyObjectType.Sets,
    };

  const legacyObjects =
    await fetchAndWriteLegacyObjects<CustomerCLegacyObjects>(
      objectsToFetch,
      languagesToCheck,
      {
        readFromDisk,
      }
    );

  const legacyCredits = convertSL8CreditsToLegacyObjects(
    legacyObjects.assets.objects,
    legacyObjects.episodes.objects,
    legacyObjects.seasons.objects,
    legacyObjects.brands.objects
  );

  await commonSkylarkConfigurationUpdates({
    assets: legacyObjects.assets.objects,
    images: legacyObjects.images.objects,
    sets: legacyObjects.sets.objects,
    defaultLanguage: languagesToCheck[0].toLowerCase(),
  });

  console.log("\nCreating Legacy Objects in Skylark...");

  await clearUnableToFindVersionNoneObjectsFile();

  const skylarkObjects = createEmptySkylarkObjects();

  const commonArgs = {
    relationshipObjects: skylarkObjects,
    legacyObjectConverter: convertLegacyObject,
    isCreateOnly,
    legacyCredits,
    // alwaysAvailability,
  };

  skylarkObjects.tagCategories = await createObjectsInSkylark(
    legacyObjects.tagCategories,
    commonArgs
  );

  skylarkObjects.tags = await createObjectsInSkylark(
    legacyObjects.tags,
    commonArgs
  );

  skylarkObjects.images = await createObjectsInSkylark(
    legacyObjects.images,
    commonArgs
  );

  skylarkObjects.ratings = await createObjectsInSkylark(
    legacyObjects.ratings,
    commonArgs
  );

  skylarkObjects.genres = await createObjectsInSkylark(
    legacyObjects.genres,
    commonArgs
  );

  skylarkObjects.people = await createObjectsInSkylark(
    legacyObjects.people,
    commonArgs
  );

  skylarkObjects.roles = await createObjectsInSkylark(
    legacyObjects.roles,
    commonArgs
  );

  // Create Credits after People and Roles but before Assets/Episodes/Seasons/Brands/Sets
  skylarkObjects.credits = await createObjectsInSkylark(
    legacyCredits,
    commonArgs
  );

  skylarkObjects.assets = await createObjectsInSkylark(
    legacyObjects.assets,
    commonArgs
  );

  skylarkObjects.episodes = await createObjectsInSkylark(
    legacyObjects.episodes,
    commonArgs
  );

  skylarkObjects.seasons = await createObjectsInSkylark(
    legacyObjects.seasons,
    commonArgs
  );

  skylarkObjects.brands = await createObjectsInSkylark(
    legacyObjects.brands,
    commonArgs
  );

  skylarkObjects.sets = await createObjectsInSkylark(
    legacyObjects.sets,
    commonArgs
  );

  await createSetContent(
    skylarkObjects.sets,
    legacyObjects.sets,
    skylarkObjects
  );
};

/* eslint-enable no-console */
