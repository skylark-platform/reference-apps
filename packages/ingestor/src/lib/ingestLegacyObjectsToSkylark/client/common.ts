/* eslint-disable no-console */

import { ensureDir } from "fs-extra";
import {
  createLegacyObjectsTimeStampedDir,
  readLegacyObjectsFromFile,
  writeAllLegacyObjectsToDisk,
  writeStatsForLegacyObjectsToDisk,
} from "../fs";
import { fetchLegacyObjectsAndWriteToDisk } from "../legacy";
import {
  FetchedLegacyObjects,
  LegacyAsset,
  LegacyImage,
  LegacyObjectType,
  LegacyObjects,
  LegacySet,
} from "../types/legacySkylark";
import { calculateTotalObjects, updateSkylarkSchema } from "../utils";
import { setAccountConfiguration } from "../../skylark/saas/account";
import { CreatedSkylarkObjects } from "../types/skylark";

const fetchLegacyObjects = async <T>(
  objectsToFetch: Record<string, LegacyObjectType>,
  languagesToCheck: string[]
) => {
  const dir = await createLegacyObjectsTimeStampedDir();
  await ensureDir(dir);

  const retObj: Record<string, FetchedLegacyObjects<LegacyObjects[0]>> = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, legacyObjectType] of Object.entries(objectsToFetch)) {
    // eslint-disable-next-line no-await-in-loop
    const objects = await fetchLegacyObjectsAndWriteToDisk<LegacyObjects[0]>(
      legacyObjectType,
      dir,
      languagesToCheck
    );

    retObj[key] = objects;
  }

  const totalObjectsFound = calculateTotalObjects(retObj);
  console.log(
    `--- ${totalObjectsFound} objects found (${languagesToCheck.length} languages checked)`
  );

  return retObj as T;
};

export const fetchAndWriteLegacyObjects = async <
  T extends Record<string, FetchedLegacyObjects<LegacyObjects[0]>>
>(
  objectsToFetch: Record<string, LegacyObjectType>,
  languagesToCheck: string[],
  {
    readFromDisk,
  }: {
    readFromDisk?: boolean;
  }
): Promise<T> => {
  let legacyObjects: T | null = null;

  if (readFromDisk) {
    console.log("\nReading Legacy Objects from Disk...");
    legacyObjects = await readLegacyObjectsFromFile<T>(objectsToFetch);
  } else {
    console.log("\nFetching Objects from Legacy Skylark...");
    legacyObjects = await fetchLegacyObjects<T>(
      objectsToFetch,
      languagesToCheck
    );
    console.log("\nWriting Legacy Objects to disk...");
    await writeAllLegacyObjectsToDisk(legacyObjects);
  }

  console.log("\nWriting Stats to Disk...");
  await writeStatsForLegacyObjectsToDisk(legacyObjects, languagesToCheck);

  return legacyObjects;
};

export const commonSkylarkConfigurationUpdates = async ({
  assets,
  images,
  sets,
  defaultLanguage,
}: {
  assets: Record<string, LegacyAsset[]>;
  images?: Record<string, LegacyImage[]>;
  sets?: Record<string, LegacySet[]>;
  defaultLanguage: string;
}) => {
  console.log("\nUpdating Skylark Schema...");

  const assetTypes = [
    ...new Set(
      Object.values(assets)
        .flatMap((arr) => arr)
        .map(({ asset_type_url }) => asset_type_url?.name)
    ),
  ].filter((name): name is string => !!name);
  console.log("--- Required Asset type enums:", assetTypes.join(", "));

  const imageTypes = images
    ? [
        ...new Set(
          Object.values(images)
            .flatMap((arr) => arr)
            .map(({ image_type }) => image_type)
        ),
      ].filter((name): name is string => !!name)
    : null;

  if (imageTypes)
    console.log("--- Required Image type enums:", imageTypes.join(", "));

  const setTypes = sets
    ? [
        ...new Set(
          Object.values(sets)
            .flatMap((arr) => arr)
            .map(({ set_type_slug }) => set_type_slug)
        ),
      ].filter((name): name is string => !!name)
    : null;

  if (setTypes)
    console.log("--- Required Set type enums:", setTypes.join(", "));

  await updateSkylarkSchema({ assetTypes, imageTypes, setTypes });

  console.log("\nUpdating Skylark Account...");
  await setAccountConfiguration({
    defaultLanguage,
  });
};

export const createEmptySkylarkObjects = (): CreatedSkylarkObjects => ({
  availabilities: [],
  tagCategories: [],
  tags: [],
  people: [],
  roles: [],
  genres: [],
  ratings: [],
  images: [],
  credits: [],
  assets: [],
  episodes: [],
  seasons: [],
  brands: [],
  sets: [],
});

/* eslint-enable no-console */
