/* eslint-disable no-console */
import {
  FetchedLegacyObjects,
  LegacyAsset,
  LegacyBrand,
  LegacyEpisode,
  LegacyObjectType,
  LegacyObjects,
  LegacyObjectsWithSynopsis,
  LegacySeason,
  LegacyTag,
  LegacyTagCategory,
  ParsedSL8Credits,
} from "../types/legacySkylark";

import { ALWAYS_FOREVER_AVAILABILITY_EXT_ID } from "../constants";
import { createAlwaysAndForeverAvailability } from "../../skylark/saas/availability";
import { createObjectsInSkylark } from "../skylark";
import { ConvertedLegacyObject } from "../types/skylark";

import { clearUnableToFindVersionNoneObjectsFile } from "../../skylark/saas/fs";
import {
  commonSkylarkConfigurationUpdates,
  createEmptySkylarkObjects,
  fetchAndWriteLegacyObjects,
} from "./common";

interface CustomerALegacyObjects
  extends Record<string, FetchedLegacyObjects<LegacyObjects[0]>> {
  tagCategories: FetchedLegacyObjects<LegacyTagCategory>;
  tags: FetchedLegacyObjects<LegacyTag>;
  assets: FetchedLegacyObjects<LegacyAsset>;
  episodes: FetchedLegacyObjects<LegacyEpisode>;
  seasons: FetchedLegacyObjects<LegacySeason>;
  brands: FetchedLegacyObjects<LegacyBrand>;
}

const languagesToCheck = [
  "EN",
  "BG",
  "ES",
  "HR",
  "HU",
  "ID",
  "IT",
  "KO",
  "MK",
  "PL",
  "PT",
  "RO",
  "RU",
  "SL",
  "SR",
  "TR",
  "UK",
  "VI",
  "ZH",
  "MN",
];

const assetTypesToIgnore = ["audiobook", "app"];

/**
 * As per Slack messages
 * - Alternative Synopsis -> Synopsis
 * - Synopsis             -> Episode Number
 * So this function isn't required
 */
const getSynopsisForMedia = (legacyObject: LegacyObjectsWithSynopsis) => {
  // We want to make sure that we add synopsis, then short_synopsis in the order alternate_synopsis -> synopsis -> extended_synopsis
  const synopsis = legacyObject.alternate_synopsis;
  // const synopsisShort =
  //   (synopsis && synopsis !== legacyObject.synopsis && legacyObject.synopsis) ||
  //   (synopsis !== legacyObject.extended_synopsis &&
  //     legacyObject.extended_synopsis) ||
  //   "";

  return {
    synopsis,
    // synopsisShort,
  };
};

/**
 * As per Slack messages
 * - Synopsis -> Episode Number
 */
const parseEpisodeNumberFromSynopsisField = (
  legacyObject: LegacyObjectsWithSynopsis,
): number | null => {
  try {
    if (legacyObject.synopsis) {
      const int = parseInt(legacyObject.synopsis, 10);
      return int;
    }
  } catch {
    return null;
  }
  return null;
};

const internalTitle = (
  legacyObject: LegacyObjectsWithSynopsis,
  language?: string,
): Record<string, string | null> => {
  if (language?.toUpperCase() === "EN") {
    // name -> internal_title
    // BUT we're converting a translatable field to global so only take the English version
    return {
      internal_title: legacyObject.name || null,
    };
  }

  return {};
};

const convertLegacyObject = (
  legacyObject: LegacyObjects[0] | ParsedSL8Credits,
  language?: string,
): ConvertedLegacyObject | null => {
  // eslint-disable-next-line no-underscore-dangle
  const legacyObjectType = legacyObject._type;
  const legacyUid = legacyObject.uid;
  if (!legacyObjectType) {
    throw new Error(
      `[convertLegacyObject] Unknown legacy object type: ${legacyUid}`,
    );
  }

  const commonFields = {
    ...legacyObject, // By adding the whole legacy object to each object, the introspection create will add any missing fields that are
    external_id: legacyObject.uid,
  };

  if (legacyObjectType === LegacyObjectType.Games) {
    const { synopsis } = getSynopsisForMedia(legacyObject);

    return {
      ...commonFields,
      ...internalTitle(legacyObject, language),
      title: legacyObject.title,
      synopsis,
    };
  }

  if (legacyObjectType === LegacyObjectType.Assets) {
    const assetType = legacyObject.asset_type_url?.name || null;
    if (assetType && assetTypesToIgnore.includes(assetType.toLowerCase())) {
      return null;
    }
    const { synopsis } = getSynopsisForMedia(legacyObject);

    return {
      ...commonFields,
      ...internalTitle(legacyObject, language),
      title: legacyObject.title,
      synopsis,
      type: assetType,
      duration: legacyObject.duration_in_seconds,
      url: legacyObject.url !== "" ? legacyObject.url : null,
      // state: legacyObject.state, Can't add this to SkylarkAsset
    };
  }

  if (legacyObjectType === LegacyObjectType.Episodes) {
    const { synopsis } = getSynopsisForMedia(legacyObject);

    const fields: Record<string, string | number | null> = {
      ...internalTitle(legacyObject, language),
      title: legacyObject.title,
      synopsis,
      episode_number:
        parseEpisodeNumberFromSynopsisField(legacyObject) ||
        legacyObject.episode_number, // Client hasn't mentioned not to default to episode_number
      kaltura_id: legacyObject.new_flag,
    };

    if (language?.toUpperCase() === "EN") {
      // Synopsis is sometimes a string version of an episode_number
      // BUT Client A has said to only carry it over when the language is "en" as it is a Global field
      fields.episode_number_string = legacyObject.synopsis;
    }

    return {
      ...commonFields,
      ...fields,
    };
  }

  if (legacyObjectType === LegacyObjectType.Seasons) {
    const { synopsis } = getSynopsisForMedia(legacyObject);

    return {
      ...commonFields,
      ...internalTitle(legacyObject, language),
      title: legacyObject.title,
      synopsis,
      season_number: legacyObject.season_number,
      number_of_episodes: legacyObject.number_of_episodes,
    };
  }

  if (legacyObjectType === LegacyObjectType.Brands) {
    const { synopsis } = getSynopsisForMedia(legacyObject);

    return {
      ...commonFields,
      ...internalTitle(legacyObject, language),
      title: legacyObject.title,
      synopsis,
    };
  }

  return commonFields;
};

const splitAssetsAndGames = (
  fetchedAssets: FetchedLegacyObjects<LegacyAsset>,
): {
  assets: FetchedLegacyObjects<LegacyAsset>;
  games: FetchedLegacyObjects<LegacyAsset>;
} => {
  const totalAssetsAndGames = Object.values(fetchedAssets.objects).reduce(
    (previous, arr) => previous + arr.length,
    0,
  );

  const assetObjects: typeof fetchedAssets.objects = Object.fromEntries(
    Object.entries(fetchedAssets.objects).map(([language, objects]) => {
      const nonAppAssets = objects.filter(
        (obj) => obj.asset_type_url?.name.toUpperCase() !== "APP",
      );
      return [language, nonAppAssets];
    }),
  );

  const gameObjects: FetchedLegacyObjects<LegacyAsset>["objects"] =
    Object.fromEntries(
      Object.entries(fetchedAssets.objects).map(([language, objects]) => {
        const appAssets: LegacyAsset[] = objects
          .filter(
            (obj) =>
              obj.asset_type_url?.name &&
              obj.asset_type_url.name.toUpperCase() === "APP",
          )
          .map((obj) => ({ ...obj, _type: LegacyObjectType.Games }));
        return [language, appAssets];
      }),
    );

  const totalAssets = Object.values(assetObjects).reduce(
    (previous, arr) => previous + arr.length,
    0,
  );

  const totalGames = Object.values(gameObjects).reduce(
    (previous, arr) => previous + arr.length,
    0,
  );

  if (totalAssets + totalGames !== totalAssetsAndGames) {
    throw new Error(
      `[splitAssetsAndGames] Assets and Games don't add up to total fetched assets - Assets: ${totalAssets}, Games: ${totalGames}, Originally fetched: ${totalAssetsAndGames}`,
    );
  }

  return {
    assets: {
      ...fetchedAssets,
      objects: assetObjects,
    },
    games: {
      ...fetchedAssets,
      objects: gameObjects,
    },
  };
};

export const ingestClientA = async ({
  readFromDisk,
  isCreateOnly,
}: {
  readFromDisk: boolean;
  isCreateOnly: boolean;
}) => {
  const objectsToFetch: Record<keyof CustomerALegacyObjects, LegacyObjectType> =
    {
      tagCategories: LegacyObjectType.TagCategories,
      tags: LegacyObjectType.Tags,
      assets: LegacyObjectType.Assets,
      episodes: LegacyObjectType.Episodes,
      seasons: LegacyObjectType.Seasons,
      brands: LegacyObjectType.Brands,
    };

  const legacyObjects =
    await fetchAndWriteLegacyObjects<CustomerALegacyObjects>(
      objectsToFetch,
      languagesToCheck,
      {
        readFromDisk,
      },
    );

  await commonSkylarkConfigurationUpdates({
    assets: legacyObjects.assets.objects,
    assetTypesToIgnore,
    defaultLanguage: languagesToCheck[0].toLowerCase(),
  });

  console.log("\nCreating Always & Forever Availability...");
  const alwaysAvailability = await createAlwaysAndForeverAvailability(
    ALWAYS_FOREVER_AVAILABILITY_EXT_ID,
  );

  console.log("\nCreating Legacy Objects in Skylark...");

  await clearUnableToFindVersionNoneObjectsFile();

  const skylarkObjects = createEmptySkylarkObjects();

  const commonArgs = {
    relationshipObjects: skylarkObjects,
    legacyObjectConverter: convertLegacyObject,
    isCreateOnly,
    alwaysAvailability,
  };

  skylarkObjects.tagCategories = await createObjectsInSkylark(
    legacyObjects.tagCategories,
    commonArgs,
  );

  skylarkObjects.tags = await createObjectsInSkylark(
    legacyObjects.tags,
    commonArgs,
  );

  const { assets, games } = splitAssetsAndGames(legacyObjects.assets);

  skylarkObjects.games = await createObjectsInSkylark(
    {
      ...games,
      type: LegacyObjectType.Games, // Override
    },
    commonArgs,
  );

  skylarkObjects.assets = await createObjectsInSkylark(assets, commonArgs);

  skylarkObjects.episodes = await createObjectsInSkylark(
    legacyObjects.episodes,
    commonArgs,
  );

  skylarkObjects.seasons = await createObjectsInSkylark(
    legacyObjects.seasons,
    commonArgs,
  );

  skylarkObjects.brands = await createObjectsInSkylark(
    legacyObjects.brands,
    commonArgs,
  );
};

/* eslint-enable no-console */
