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
  FetchedLegacyObjects,
  LegacyBrand,
  LegacyObjectType,
  LegacyObjects,
} from "./types/legacySkylark";
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

  const client = process.env.CLIENT
    ? `${process.env.CLIENT.toLowerCase()}/`
    : "";

  const env = process.env.LEGACY_API_URL
    ? process.env.LEGACY_API_URL.replace("https://", "")
        .replaceAll(".", "_")
        .replaceAll("-", "_")
    : "unknown";

  const dir = `${client}${env}`;

  if (onlyDataCreatedInLastMonth) {
    return `${dir}_last_month_only`;
  }

  return dir;
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

export const writeLegacyObjectsToDisk = async (
  dir: string,
  obj: {
    type: LegacyObjectType;
    objects: Record<string, object[]>;
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
  objects: Record<string, FetchedLegacyObjects<LegacyObjects[0]>>
) => {
  try {
    const dir = await createLegacyObjectsTimeStampedDir();

    await Promise.all(
      Object.values(objects).map((value) =>
        writeLegacyObjectsToDisk(dir, value)
      )
    );
  } catch (err) {
    console.error("[writeAllLegacyObjectsToDisk] Failed to write data");
  }
};

export const writeStatsForLegacyObjectsToDisk = async (
  legacyObjects: Record<string, FetchedLegacyObjects<LegacyObjects[0]>>,
  languages: string[]
) => {
  try {
    const env = generateEnvIdentifier();
    const file = join(generateLegacyObjectsDir(), "stats.md");

    await ensureFile(file);

    const totalObjectsFound = calculateTotalObjects(legacyObjects);

    let contents = `# Stats for ${env}\n\nTotal objects across ${languages.length} languages: ${totalObjectsFound}`;

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

export const readLegacyObjectsFromFile = async <T>(
  objectsToFetch: Record<string, LegacyObjectType>
): Promise<T> => {
  const mostRecentDir = await getMostRecentLegacyObjectsDir();

  console.log(`--- Using directory "${mostRecentDir}"`);

  const retObj: Record<string, FetchedLegacyObjects<LegacyObjects[0]>> = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, legacyObjectType] of Object.entries(objectsToFetch)) {
    // eslint-disable-next-line no-await-in-loop
    const objects = await readObjectsFromFile<LegacyBrand>(
      mostRecentDir,
      legacyObjectType
    );

    retObj[key] = objects;
  }

  const totalObjectsFound = calculateTotalObjects(retObj);
  console.log(`--- ${totalObjectsFound} objects read from disk`);

  return retObj as T;
};

/* eslint-enable no-console */
