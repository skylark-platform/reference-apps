import "../../env";
import "./env";
import { SAAS_API_ENDPOINT, SAAS_API_KEY } from "@skylark-reference-apps/lib";
import {
  ensureDir,
  ensureFile,
  exists,
  outputFile,
  readFile,
  readJson,
  readdir,
  writeFile,
} from "fs-extra";
import { join } from "path";
import { fetchObjectsFromLegacySkylark } from "./legacy";
import {
  LegacyAsset,
  LegacyBrand,
  LegacyCommonObject,
  LegacyEpisode,
  LegacyObjectType,
  LegacyObjects,
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

const calculateTotalObjects = (
  objects: Record<
    string,
    {
      type: LegacyObjectType;
      objects: Record<string, LegacyObjects>;
      totalFound: number;
    }
  >
) => {
  const totalObjectsFound = Object.values(objects).reduce(
    (previous, { totalFound }) => previous + totalFound,
    0
  );

  return totalObjectsFound;
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

const generateEnvIdentifier = () => {
  const env = process.env.LEGACY_API_URL
    ? process.env.LEGACY_API_URL.replace("https://", "")
        .replaceAll(".", "_")
        .replaceAll("-", "_")
    : "unknown";
  return env;
};

const generateLegacyObjectsDir = () => {
  const env = generateEnvIdentifier();

  const dir = join(__dirname, "outputs", "legacy_data", env);
  return dir;
};

const createLegacyObjectsTimeStampedDir = async () => {
  const dateStamp = new Date().toISOString();

  const dir = join(generateLegacyObjectsDir(), dateStamp);

  await ensureDir(dir);

  return dir;
};

const writeLegacyObjectsToDisk = async <T>(
  dir: string,
  obj: {
    type: LegacyObjectType;
    objects: Record<string, T[]>;
    totalFound: number;
  }
) => {
  try {
    await writeFile(
      join(dir, `${obj.type}.json`),
      JSON.stringify(obj, null, 4)
    );
  } catch (err) {
    console.error(
      `[writeLegacyObjectsToDisk] Failed to write ${obj.type} data`
    );
  }
};

const writeAllLegacyObjectsToDisk = async (
  objects: Record<
    string,
    {
      type: LegacyObjectType;
      objects: Record<string, LegacyObjects>;
      totalFound: number;
    }
  >
) => {
  try {
    const dir = await createLegacyObjectsTimeStampedDir();

    await Promise.all(
      Object.values(objects).map((value) =>
        writeLegacyObjectsToDisk<LegacyObjects[0]>(dir, value)
      )
    );
  } catch (err) {
    console.error("[writeAllLegacyObjectsToDisk] Failed to write data");
  }
};

const writeStatsForLegacyObjectsToDisk = async (
  legacyObjects: Record<
    string,
    {
      type: LegacyObjectType;
      objects: Record<string, LegacyObjects>;
      totalFound: number;
    }
  >
) => {
  try {
    const env = generateEnvIdentifier();
    const file = join(generateLegacyObjectsDir(), "stats.md");

    await ensureFile(file);

    const totalObjectsFound = calculateTotalObjects(legacyObjects);

    let contents = `# Stats for ${env}\n\nTotal objects across ${USED_LANGUAGES.length} languages: ${totalObjectsFound}`;

    Object.values(legacyObjects).forEach(({ type, objects, totalFound }) => {
      contents += `\n\n## ${type} (${totalFound} total)\n`;

      Object.entries(objects).forEach(([language, objs]) => {
        contents += `  - \`${language.toLowerCase()}\`: \`${objs.length}\`\n`;
      });

      contents += "\n---";
    });

    await writeFile(file, contents);
  } catch (err) {
    console.error("[writeAllLegacyObjectsToDisk] Failed to write data");
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

const readObjectsFromFile = async <T>(type: LegacyObjectType) => {
  const parentDir = generateLegacyObjectsDir();
  await ensureDir(parentDir);

  const objectDirs = (await readdir(parentDir)).filter(
    (dir) => dir !== "stats.md"
  );

  const [mostRecentDir] = objectDirs.sort((a, b) =>
    new Date(a).getMilliseconds() < new Date(b).getMilliseconds() ? 1 : -1
  );

  const file = join(parentDir, mostRecentDir, `${type}.json`);

  if (!mostRecentDir || !(await exists(file))) {
    return {
      type,
      objects: {},
      totalFound: 0,
    };
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

  const episodes = await readObjectsFromFile<LegacyEpisode>(
    LegacyObjectType.Episodes
  );

  const seasons = await readObjectsFromFile<LegacySeason>(
    LegacyObjectType.Seasons
  );

  const brands = await readObjectsFromFile<LegacyBrand>(
    LegacyObjectType.Brands
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

  skylarkObjects.episodes = await createObjectsInSkylark(
    legacyObjects.episodes,
    skylarkObjects,
    alwaysAvailability
  );

  skylarkObjects.seasons = await createObjectsInSkylark(
    legacyObjects.seasons,
    skylarkObjects,
    alwaysAvailability
  );

  skylarkObjects.brands = await createObjectsInSkylark(
    legacyObjects.brands,
    skylarkObjects,
    alwaysAvailability
  );

  console.log("\nObjects Created Successfully.");
};

const writeError = async (err: unknown) => {
  const errorFile = join(__dirname, "outputs", "ingest_errors.md");

  await ensureFile(errorFile);

  const contents = await readFile(errorFile, "utf8");

  const dateStamp = new Date().toISOString();
  const readFromDisk = process.env.READ_LEGACY_OBJECTS_FROM_DISK === "true";

  const newContents = `${contents}\n---\n\n## ${dateStamp} (${
    readFromDisk ? "Data from disk" : "Data from Skylark"
  })\n\n\`\`\`\n${err as string}\n\`\`\`\n`;

  await outputFile(errorFile, newContents);
};

main().catch((err) => {
  console.error(err);
  void writeError(err);
});
/* eslint-enable no-console */
