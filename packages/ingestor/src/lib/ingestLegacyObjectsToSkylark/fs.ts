/* eslint-disable no-console */
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
import {
  LegacyAsset,
  LegacyBrand,
  LegacyEpisode,
  LegacyObjectType,
  LegacyObjects,
  LegacySeason,
  LegacyTag,
  LegacyTagCategory,
} from "./types/legacySkylark";
import { USED_LANGUAGES } from "./constants";
import { calculateTotalObjects } from "./utils";

export const writeError = async (err: unknown) => {
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

const generateEnvIdentifier = () => {
  const onlyDataCreatedInLastMonth =
    process.env.LEGACY_DATA_LAST_MONTH_ONLY === "true";

  const env = process.env.LEGACY_API_URL
    ? process.env.LEGACY_API_URL.replace("https://", "")
        .replaceAll(".", "_")
        .replaceAll("-", "_")
    : "unknown";

  if (onlyDataCreatedInLastMonth) {
    return `${env}_last_month_only`;
  }

  return env;
};

const generateLegacyObjectsDir = () => {
  const env = generateEnvIdentifier();

  const dir = join(__dirname, "outputs", "legacy_data", env);
  return dir;
};

export const getMostRecentLegacyObjectsDir = async () => {
  const parentDir = generateLegacyObjectsDir();
  await ensureDir(parentDir);

  const objectDirs = (await readdir(parentDir)).filter(
    (dir) => dir !== "stats.md"
  );

  const [mostRecentDir] = objectDirs.sort(
    (a, b) => +new Date(b) - +new Date(a)
  );

  return join(parentDir, mostRecentDir);
};

export const createLegacyObjectsTimeStampedDir = async () => {
  const dateStamp = new Date().toISOString();

  const dir = join(generateLegacyObjectsDir(), dateStamp);

  await ensureDir(dir);

  return dir;
};

export const writeLegacyObjectsToDisk = async <T>(
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

export const writeAllLegacyObjectsToDisk = async (
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

export const writeStatsForLegacyObjectsToDisk = async (
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

export const readObjectsFromFile = async <T>(
  dir: string,
  type: LegacyObjectType
) => {
  const file = join(dir, `${type}.json`);

  if (!(await exists(file))) {
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

export const readLegacyObjectsFromFile = async () => {
  const mostRecentDir = await getMostRecentLegacyObjectsDir();

  console.log(`--- Using directory "${mostRecentDir}"`);

  const tagCategories = await readObjectsFromFile<LegacyTagCategory>(
    mostRecentDir,
    LegacyObjectType.TagCategories
  );

  const tags = await readObjectsFromFile<LegacyTag>(
    mostRecentDir,
    LegacyObjectType.Tags
  );

  const assets = await readObjectsFromFile<LegacyAsset>(
    mostRecentDir,
    LegacyObjectType.Assets
  );

  const episodes = await readObjectsFromFile<LegacyEpisode>(
    mostRecentDir,
    LegacyObjectType.Episodes
  );

  const seasons = await readObjectsFromFile<LegacySeason>(
    mostRecentDir,
    LegacyObjectType.Seasons
  );

  const brands = await readObjectsFromFile<LegacyBrand>(
    mostRecentDir,
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

/* eslint-enable no-console */
