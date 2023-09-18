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

const assetTypesToIgnore = ["audiobook"];

const getSynopsisForMedia = (legacyObject: LegacyObjectsWithSynopsis) => {
  // We want to make sure that we add synopsis, then short_synopsis in the order alternate_synopsis -> synopsis -> extended_synopsis
  const synopsis =
    legacyObject.alternate_synopsis ||
    legacyObject.synopsis ||
    legacyObject.extended_synopsis;
  const synopsisShort =
    (synopsis && synopsis !== legacyObject.synopsis && legacyObject.synopsis) ||
    (synopsis !== legacyObject.extended_synopsis &&
      legacyObject.extended_synopsis) ||
    "";

  return {
    synopsis,
    synopsisShort,
  };
};

const convertLegacyObject = (
  legacyObject: LegacyObjects[0] | ParsedSL8Credits,
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

  if (legacyObjectType === LegacyObjectType.Assets) {
    const assetType = legacyObject.asset_type_url?.name || null;
    if (assetType && assetTypesToIgnore.includes(assetType)) {
      return null;
    }
    const { synopsis, synopsisShort } = getSynopsisForMedia(legacyObject);

    return {
      ...commonFields,
      internal_title: legacyObject.name,
      title: legacyObject.title,
      synopsis,
      synopsis_short: synopsisShort,
      type: assetType,
      duration: legacyObject.duration_in_seconds,
      url: legacyObject.url !== "" ? legacyObject.url : null,
      // state: legacyObject.state, Can't add this to SkylarkAsset
    };
  }

  if (legacyObjectType === LegacyObjectType.Episodes) {
    const { synopsis, synopsisShort } = getSynopsisForMedia(legacyObject);
    return {
      ...commonFields,
      internal_title: legacyObject.name,
      title: legacyObject.title,
      synopsis,
      synopsis_short: synopsisShort,
      episode_number: legacyObject.episode_number,
      kaltura_id: legacyObject.new_flag,
    };
  }

  if (legacyObjectType === LegacyObjectType.Seasons) {
    const { synopsis, synopsisShort } = getSynopsisForMedia(legacyObject);

    return {
      ...commonFields,
      internal_title: legacyObject.name,
      title: legacyObject.title,
      synopsis,
      synopsis_short: synopsisShort,
      season_number: legacyObject.season_number,
      number_of_episodes: legacyObject.number_of_episodes,
    };
  }

  if (legacyObjectType === LegacyObjectType.Brands) {
    const { synopsis, synopsisShort } = getSynopsisForMedia(legacyObject);

    return {
      ...commonFields,
      internal_title: legacyObject.name,
      title: legacyObject.title,
      synopsis,
      synopsis_short: synopsisShort,
    };
  }

  return commonFields;
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

  skylarkObjects.assets = await createObjectsInSkylark(
    legacyObjects.assets,
    commonArgs,
  );

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
