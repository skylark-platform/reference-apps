import {
  ensureDir,
  ensureFile,
  exists,
  move,
  readJSON,
  writeJSON,
} from "fs-extra";
import { GraphQLBaseObject } from "../../interfaces";

const unableToFindVersionNoneObjectsFileName = "unableToFindVersionNoneObjects";
const unableToFindVersionNoneObjectsFile = `./outputs/${unableToFindVersionNoneObjectsFileName}.json`;

export const writeAirtableOutputFile = async (
  dateStamp: string,
  output: object
) => {
  await ensureDir("./outputs/airtable");
  await writeJSON(`./outputs/airtable/${dateStamp}.json`, output);
};

const writeGraphQLBaseObjectsToDisk = async (
  file: string,
  objects: GraphQLBaseObject[]
) => {
  try {
    const { objects: existingObjects } = (await exists(file))
      ? ((await readJSON(file)) as { objects: GraphQLBaseObject[] })
      : { objects: [] };

    const newObjects = [...existingObjects, ...objects];

    await ensureFile(file);
    await writeJSON(file, { objects: newObjects });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      "[writeGraphQLBaseObjectsToDisk] Error writing GraphQL Base Objects to disk"
    );
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

export const writeUnableToFindVersionNoneObjectsFile = async (
  objects: GraphQLBaseObject[]
) => {
  await writeGraphQLBaseObjectsToDisk(
    unableToFindVersionNoneObjectsFile,
    objects
  );
};

export const clearUnableToFindVersionNoneObjectsFile = async () => {
  if (await exists(unableToFindVersionNoneObjectsFile)) {
    const dateStamp = new Date().toISOString();
    await move(
      unableToFindVersionNoneObjectsFile,
      `./outputs/${unableToFindVersionNoneObjectsFileName}_old/${unableToFindVersionNoneObjectsFileName}_${dateStamp}.json`
    );
  }

  await writeGraphQLBaseObjectsToDisk(unableToFindVersionNoneObjectsFile, []);
};
