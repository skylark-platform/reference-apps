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

const objectMetaFileName = `_meta.json`;

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
    (dir) => dir !== "stats.md",
  );

  const [mostRecentDir] = objectDirs.sort(
    (a, b) => +new Date(b) - +new Date(a),
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
  },
) => {
  const maxArrSize = 100000;

  try {
    const requiresMultipleFiles = obj.totalFound > maxArrSize;
    if (requiresMultipleFiles) {
      const { objects, ...meta } = obj;

      const objectDir = join(dir, obj.type);
      await ensureDir(objectDir);

      console.log(
        `    - ${obj.type} requires multiple files to write to (${objectDir})`,
      );

      const languages = Object.keys(objects);

      // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-for-in-array
      for (const language of languages) {
        const languageObjects = objects[language];
        const filepath = join(objectDir, `${language.toLowerCase()}.json`);

        // eslint-disable-next-line no-await-in-loop
        await writeFile(filepath, JSON.stringify(languageObjects, null, 4));
      }

      // After all languages are written, write the _meta.json containing other properties
      const metaFile = join(objectDir, objectMetaFileName);
      await writeFile(metaFile, JSON.stringify(meta, null, 4));
    } else {
      await writeFile(
        join(dir, `${obj.type}.json`),
        JSON.stringify(obj, null, 4),
      );
    }
  } catch (err) {
    console.error(
      `[writeLegacyObjectsToDisk] Failed to write ${obj.type} data`,
    );
    console.error(err);
  }
};

export const writeAllLegacyObjectsToDisk = async (
  objects: Record<string, FetchedLegacyObjects<LegacyObjects[0]>>,
) => {
  try {
    const dir = await createLegacyObjectsTimeStampedDir();

    await Promise.all(
      Object.values(objects).map((value) =>
        writeLegacyObjectsToDisk(dir, value),
      ),
    );
  } catch (err) {
    console.error("[writeAllLegacyObjectsToDisk] Failed to write data");
  }
};

export const writeStatsForLegacyObjectsToDisk = async (
  legacyObjects: Record<string, FetchedLegacyObjects<LegacyObjects[0]>>,
  languages: string[],
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

export const readObjectsFromDisk = async <T>(
  dir: string,
  type: LegacyObjectType,
): Promise<{
  type: LegacyObjectType;
  objects: Record<string, T[]>;
  totalFound: number;
}> => {
  const objectFile = join(dir, `${type}.json`);

  // When there are so many objects, the file is split into multiple by language
  const objectDir = join(dir, type);

  const fileExists = await exists(objectFile);
  const dirExists = await exists(objectDir);

  if (fileExists && dirExists) {
    throw new Error(
      `[readObjectsFromDisk] Both file and directory exists, this should be impossible! File: ${objectFile} / Dir: ${objectDir}`,
    );
  }

  if (!fileExists && !dirExists) {
    return {
      type,
      objects: {},
      totalFound: 0,
    };
  }

  if (dirExists) {
    const files = await readdir(objectDir);

    const metaFileExists = files.includes(objectMetaFileName);

    const metaFileContents = metaFileExists
      ? ((await readJson(join(objectDir, objectMetaFileName))) as {
          type: LegacyObjectType;
          totalFound: number;
        })
      : { totalFound: 0 };

    const objects: Record<string, T[]> = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      if (file !== objectMetaFileName) {
        const language = file.replace(".json", "").toUpperCase();
        // eslint-disable-next-line no-await-in-loop
        const fileContents = (await readJson(join(objectDir, file))) as T[];

        objects[language] = fileContents;
      }
    }

    const obj = {
      ...metaFileContents,
      type,
      objects,
    };

    return obj;
  }

  const data = (await readJson(objectFile)) as {
    type: LegacyObjectType;
    objects: Record<string, T[]>;
    totalFound: number;
  };

  return data;
};

export const readLegacyObjectsFromFile = async <T>(
  objectsToFetch: Record<string, LegacyObjectType>,
): Promise<T> => {
  const mostRecentDir = await getMostRecentLegacyObjectsDir();

  console.log(`--- Using directory "${mostRecentDir}"`);

  const retObj: Record<string, FetchedLegacyObjects<LegacyObjects[0]>> = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, legacyObjectType] of Object.entries(objectsToFetch)) {
    // eslint-disable-next-line no-await-in-loop
    const objects = await readObjectsFromDisk<LegacyBrand>(
      mostRecentDir,
      legacyObjectType,
    );

    retObj[key] = objects;
  }

  const totalObjectsFound = calculateTotalObjects(retObj);
  console.log(`--- ${totalObjectsFound} objects read from disk`);

  return retObj as T;
};

/* eslint-enable no-console */
