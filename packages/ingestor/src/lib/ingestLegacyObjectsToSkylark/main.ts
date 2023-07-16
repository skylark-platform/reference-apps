/* eslint-disable no-console */
import "../../env";
import "./env";
import { ensureDir } from "fs-extra";
import { fetchObjectsFromLegacySkylark } from "./legacy";
import {
  LegacyAsset,
  LegacyBrand,
  LegacyCommonObject,
  LegacyEpisode,
  LegacyObjectType,
  LegacySeason,
  LegacyTag,
  LegacyTagCategory,
} from "./types/legacySkylark";
import {
  activateConfigurationVersion,
  updateEnumTypes,
  waitForUpdatingSchema,
} from "../skylark/saas/schema";
import {
  ALWAYS_FOREVER_AVAILABILITY_EXT_ID,
  USED_LANGUAGES,
} from "./constants";
import { setAccountConfiguration } from "../skylark/saas/account";
import { createAlwaysAndForeverAvailability } from "../skylark/saas/availability";
import { createObjectsInSkylark } from "./skylark";
import { CreatedSkylarkObjects } from "./types/skylark";
import {
  createLegacyObjectsTimeStampedDir,
  readLegacyObjectsFromFile,
  writeAllLegacyObjectsToDisk,
  writeError,
  writeLegacyObjectsToDisk,
  writeStatsForLegacyObjectsToDisk,
} from "./fs";
import { calculateTotalObjects, checkEnvVars } from "./utils";
import { clearUnableToFindVersionNoneObjectsFile } from "../skylark/saas/fs";

const updateSkylarkSchema = async ({
  assetTypes,
}: {
  assetTypes: string[];
}) => {
  const initialVersion = await waitForUpdatingSchema();
  console.log("--- Initial Schema version:", initialVersion);

  const { version: updatedVersion } = await updateEnumTypes(
    "AssetType",
    assetTypes,
    initialVersion
  );

  if (updatedVersion && updatedVersion !== initialVersion) {
    console.log("--- Activating Schema version:", updatedVersion);
    await activateConfigurationVersion(updatedVersion);
    await waitForUpdatingSchema();
  }
};

const fetchLegacyObjectsAndWriteToDisk = async <T extends LegacyCommonObject>(
  type: LegacyObjectType,
  dir: string
) => {
  const objects = await fetchObjectsFromLegacySkylark<T>(type);
  await writeLegacyObjectsToDisk<T>(dir, objects);
  return objects;
};

const fetchLegacyObjects = async () => {
  const dir = await createLegacyObjectsTimeStampedDir();
  await ensureDir(dir);

  const tagCategories =
    await fetchLegacyObjectsAndWriteToDisk<LegacyTagCategory>(
      LegacyObjectType.TagCategories,
      dir
    );

  const tags = await fetchLegacyObjectsAndWriteToDisk<LegacyTag>(
    LegacyObjectType.Tags,
    dir
  );

  const assets = await fetchLegacyObjectsAndWriteToDisk<LegacyAsset>(
    LegacyObjectType.Assets,
    dir
  );

  const episodes = await fetchLegacyObjectsAndWriteToDisk<LegacyEpisode>(
    LegacyObjectType.Episodes,
    dir
  );

  const seasons = await fetchLegacyObjectsAndWriteToDisk<LegacySeason>(
    LegacyObjectType.Seasons,
    dir
  );

  const brands = await fetchLegacyObjectsAndWriteToDisk<LegacyBrand>(
    LegacyObjectType.Brands,
    dir
  );

  const retObj = {
    tagCategories,
    tags,
    assets,
    episodes,
    seasons,
    brands,
  };

  const totalObjectsFound = calculateTotalObjects(retObj);
  console.log(
    `--- ${totalObjectsFound} objects found (${USED_LANGUAGES.length} languages checked)`
  );

  return retObj;
};

const main = async () => {
  console.time("Total ingest time:");
  checkEnvVars();

  const readFromDisk = process.env.READ_LEGACY_OBJECTS_FROM_DISK === "true";

  let legacyObjects;

  if (readFromDisk) {
    console.log("\nReading Legacy Objects from Disk...");
    legacyObjects = await readLegacyObjectsFromFile();
  } else {
    console.log("\nFetching Objects from Legacy Skylark...");
    legacyObjects = await fetchLegacyObjects();
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

  const isCreateOnly = process.env.CREATE_ONLY === "true";
  console.log(`--- Mode: ${isCreateOnly ? "Create Only" : "Create & Update"}`);

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

  console.log("\nObjects Created Successfully.");
  console.timeEnd("Total ingest time:");
};

main().catch((err) => {
  console.error(err);
  void writeError(err);
});
/* eslint-enable no-console */
