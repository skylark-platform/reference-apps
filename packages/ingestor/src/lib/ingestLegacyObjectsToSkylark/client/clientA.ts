/* eslint-disable no-console */
import "../../../env";
import "../env";
import { ensureDir } from "fs-extra";
import {
  FetchedLegacyObjects,
  LegacyAsset,
  LegacyBrand,
  LegacyEpisode,
  LegacyObjectType,
  LegacyObjects,
  LegacySeason,
  LegacyTag,
  LegacyTagCategory,
} from "../types/legacySkylark";

import {
  ALWAYS_FOREVER_AVAILABILITY_EXT_ID,
  USED_LANGUAGES,
} from "../constants";
import { setAccountConfiguration } from "../../skylark/saas/account";
import { createAlwaysAndForeverAvailability } from "../../skylark/saas/availability";
import { createObjectsInSkylark } from "../skylark";
import { CreatedSkylarkObjects } from "../types/skylark";
import {
  createLegacyObjectsTimeStampedDir,
  readLegacyObjectsFromFile,
  writeAllLegacyObjectsToDisk,
  writeStatsForLegacyObjectsToDisk,
} from "../fs";
import { calculateTotalObjects, updateSkylarkSchema } from "../utils";
import { clearUnableToFindVersionNoneObjectsFile } from "../../skylark/saas/fs";
import { fetchLegacyObjectsAndWriteToDisk } from "../legacy";

const fetchLegacyObjects = async <T>(
  objectsToFetch: Record<string, LegacyObjectType>
) => {
  const dir = await createLegacyObjectsTimeStampedDir();
  await ensureDir(dir);

  const fetchedObjectEntries = await Promise.all(
    Object.entries(objectsToFetch).map(async ([key, legacyObjectType]) => {
      const objects = await fetchLegacyObjectsAndWriteToDisk<LegacyObjects[0]>(
        legacyObjectType,
        dir
      );

      return [key, objects];
    })
  );

  const retObj = Object.fromEntries(fetchedObjectEntries) as Record<
    string,
    FetchedLegacyObjects<LegacyObjects[0]>
  >;

  const totalObjectsFound = calculateTotalObjects(retObj);
  console.log(
    `--- ${totalObjectsFound} objects found (${USED_LANGUAGES.length} languages checked)`
  );

  return retObj as T;
};

interface CustomerALegacyObjects
  extends Record<string, FetchedLegacyObjects<LegacyObjects[0]>> {
  tagCategories: FetchedLegacyObjects<LegacyTagCategory>;
  tags: FetchedLegacyObjects<LegacyTag>;
  assets: FetchedLegacyObjects<LegacyAsset>;
  episodes: FetchedLegacyObjects<LegacyEpisode>;
  seasons: FetchedLegacyObjects<LegacySeason>;
  brands: FetchedLegacyObjects<LegacyBrand>;
}

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

  let legacyObjects: CustomerALegacyObjects | null = null;

  if (readFromDisk) {
    console.log("\nReading Legacy Objects from Disk...");
    legacyObjects = await readLegacyObjectsFromFile<CustomerALegacyObjects>();
  } else {
    console.log("\nFetching Objects from Legacy Skylark...");
    legacyObjects = await fetchLegacyObjects<CustomerALegacyObjects>(
      objectsToFetch
    );
    console.log("\nWriting Legacy Objects to disk...");
    await writeAllLegacyObjectsToDisk(legacyObjects);
  }

  console.log("\nWriting Stats to Disk...");
  await writeStatsForLegacyObjectsToDisk(legacyObjects);

  console.log("\nUpdating Skylark Schema...");

  const assetTypes = [
    ...new Set(
      Object.values(legacyObjects.assets.objects)
        .flatMap((arr) => arr)
        .map(({ asset_type_url }) => asset_type_url?.name)
    ),
  ].filter((name): name is string => !!name);
  console.log("--- Required Asset type enums:", assetTypes.join(", "));

  await updateSkylarkSchema({ assetTypes });

  console.log("\nUpdating Skylark Account...");
  await setAccountConfiguration({
    defaultLanguage: USED_LANGUAGES[0].toLowerCase(),
  });

  console.log("\nCreating Always & Forever Availability...");
  const alwaysAvailability = await createAlwaysAndForeverAvailability(
    ALWAYS_FOREVER_AVAILABILITY_EXT_ID
  );

  console.log("\nCreating Legacy Objects in Skylark...");

  await clearUnableToFindVersionNoneObjectsFile();

  const opts = {
    isCreateOnly,
    alwaysAvailability,
  };

  const skylarkObjects: CreatedSkylarkObjects = {
    tagCategories: [],
    tags: [],
    assets: [],
    episodes: [],
    seasons: [],
    brands: [],
  };

  skylarkObjects.tagCategories = await createObjectsInSkylark(
    legacyObjects.tagCategories,
    skylarkObjects,
    opts
  );

  skylarkObjects.tags = await createObjectsInSkylark(
    legacyObjects.tags,
    skylarkObjects,
    opts
  );

  skylarkObjects.assets = await createObjectsInSkylark(
    legacyObjects.assets,
    skylarkObjects,
    opts
  );

  skylarkObjects.episodes = await createObjectsInSkylark(
    legacyObjects.episodes,
    skylarkObjects,
    opts
  );

  skylarkObjects.seasons = await createObjectsInSkylark(
    legacyObjects.seasons,
    skylarkObjects,
    opts
  );

  skylarkObjects.brands = await createObjectsInSkylark(
    legacyObjects.brands,
    skylarkObjects,
    opts
  );
};

/* eslint-enable no-console */
