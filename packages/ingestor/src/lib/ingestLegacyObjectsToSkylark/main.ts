import "../../env";
import "./env";
import { SAAS_API_ENDPOINT, SAAS_API_KEY } from "@skylark-reference-apps/lib";
import { ensureDir, exists, readJson, readdir, writeFile } from "fs-extra";
import { join } from "path";
import { fetchObjectsFromLegacySkylark } from "./legacy";
import {
  LegacyAsset,
  LegacyObjectType,
  LegacyObjects,
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

/* eslint-disable no-console */
// For Macademia
// - Miro: https://miro.com/app/board/uXjVMDOKvio=/

// const objectTypes = [
//   "Brand",
//   "Season",
//   "Episode",
//   "Asset",
//   "Availability", // Not in use / make everything always available (No dimensions)
//   "Tags", // Game/App only
//   "Imagery", // Ignore
//   "Ratings", // Ignore
// ];

const checkEnvVars = () => {
  const legacyApiUrl = process.env.LEGACY_API_URL;
  const legacyToken = process.env.LEGACY_SKYLARK_TOKEN;

  if (!legacyApiUrl)
    throw new Error("process.env.LEGACY_API_URL cannot be undefined");

  if (!legacyToken)
    throw new Error("process.env.LEGACY_SKYLARK_TOKEN cannot be undefined");

  if (!SAAS_API_ENDPOINT)
    throw new Error("process.env.SAAS_API_ENDPOINT cannot be undefined");

  if (!SAAS_API_KEY)
    throw new Error("process.env.SAAS_API_KEY cannot be undefined");

  console.log("Legacy API URL:", legacyApiUrl);
  console.log("Skylark API URL:", SAAS_API_ENDPOINT);
};

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

  if (updatedVersion !== initialVersion) {
    console.log("--- Activating Schema version:", updatedVersion);
    await activateConfigurationVersion(updatedVersion);
    await waitForUpdatingSchema(updatedVersion);
  }
};

const generateLegacyObjectsDir = () => {
  const env = process.env.LEGACY_API_URL
    ? process.env.LEGACY_API_URL.replace("https://", "")
        .replaceAll(".", "_")
        .replaceAll("-", "_")
    : "unknown";

  const dir = join(__dirname, "outputs", "legacy_data", env);
  return dir;
};

const writeLegacyObjectsToDisk = async (
  objects: Record<
    string,
    {
      type: LegacyObjectType;
      objects: Record<string, LegacyObjects>;
      totalFound: number;
    }
  >
) => {
  const dateStamp = new Date().toISOString();

  const dir = join(generateLegacyObjectsDir(), dateStamp);

  await ensureDir(dir);

  Object.values(objects).map(async (value) => {
    await writeFile(
      join(dir, `${value.type}.json`),
      JSON.stringify(value, null, 4)
    );
  });
};

const fetchLegacyObjects = async () => {
  const tagCategories = await fetchObjectsFromLegacySkylark<LegacyTagCategory>(
    LegacyObjectType.TagCategories
  );

  const tags = await fetchObjectsFromLegacySkylark<LegacyTag>(
    LegacyObjectType.Tags
  );

  const assets = await fetchObjectsFromLegacySkylark<LegacyAsset>(
    LegacyObjectType.Assets
  );

  // const episodes = await fetchObjectsFromLegacySkylark<LegacyEpisode>(
  //   LegacyObjectType.Episodes
  // );

  // const seasons = await fetchObjectsFromLegacySkylark<LegacySeason>(
  //   LegacyObjectType.Seasons
  // );

  // const brands = await fetchObjectsFromLegacySkylark<LegacyBrand>(
  //   LegacyObjectType.Brands
  // );

  const retObj = {
    tagCategories,
    tags,
    assets,
    // episodes,
    // seasons,
    // brands,
  };

  const totalObjectsFound = Object.values(retObj).reduce(
    (previous, { totalFound }) => previous + totalFound,
    0
  );
  console.log(
    `--- ${totalObjectsFound} objects found (${USED_LANGUAGES.length} languages checked)`
  );

  return retObj;
};

const readObjectsFromFile = async <T>(type: LegacyObjectType) => {
  const parentDir = generateLegacyObjectsDir();
  await ensureDir(parentDir);

  const objectDirs = await readdir(parentDir);

  const [mostRecentDir] = objectDirs.sort((a, b) =>
    new Date(a).getMilliseconds() > new Date(b).getMilliseconds() ? 1 : -1
  );

  const file = join(parentDir, mostRecentDir, `${type}.json`);

  if (!(await exists(file))) {
    throw new Error(
      `[readObjectsFromFile] expected ${file} to exist but it was not found`
    );
  }

  const data = (await readJson(file)) as {
    type: LegacyObjectType;
    objects: Record<string, T[]>;
    totalFound: number;
  };

  return data;
};

const readLegacyObjectsFromFile = async () => {
  const tagCategories = await readObjectsFromFile<LegacyTagCategory>(
    LegacyObjectType.TagCategories
  );

  const tags = await readObjectsFromFile<LegacyTag>(LegacyObjectType.Tags);

  const assets = await readObjectsFromFile<LegacyAsset>(
    LegacyObjectType.Assets
  );

  const retObj = {
    tagCategories,
    tags,
    assets,
    // episodes,
    // seasons,
    // brands,
  };

  const totalObjectsFound = Object.values(retObj).reduce(
    (previous, { totalFound }) => previous + totalFound,
    0
  );
  console.log(
    `--- ${totalObjectsFound} objects read from disk (${USED_LANGUAGES.length} languages)`
  );

  return retObj;
};

const main = async () => {
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
    await writeLegacyObjectsToDisk(legacyObjects);
  }

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

  console.log("\nCreating Always & Forever Availability");
  const alwaysAvailability = await createAlwaysAndForeverAvailability(
    ALWAYS_FOREVER_AVAILABILITY_EXT_ID
  );

  console.log("\nCreating Legacy Objects in Skylark...");

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
    alwaysAvailability
  );

  skylarkObjects.tags = await createObjectsInSkylark(
    legacyObjects.tags,
    skylarkObjects,
    alwaysAvailability
  );

  skylarkObjects.assets = await createObjectsInSkylark(
    legacyObjects.assets,
    skylarkObjects,
    alwaysAvailability
  );

  // skylarkObjects.episodes = await createObjectsInSkylark(
  //   legacyObjects.episodes,
  //   skylarkObjects,
  //   alwaysAvailability
  // );

  // skylarkObjects.seasons = await createObjectsInSkylark(
  //   legacyObjects.seasons,
  //   skylarkObjects,
  //   alwaysAvailability
  // );

  // skylarkObjects.brands = await createObjectsInSkylark(
  //   legacyObjects.brands,
  //   skylarkObjects,
  //   alwaysAvailability
  // );

  console.log("\nObjects Created Successfully.");
};

main().catch(console.error);
/* eslint-enable no-console */
