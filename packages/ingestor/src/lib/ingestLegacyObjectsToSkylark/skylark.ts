import { hasProperty } from "@skylark-apps/skylarktv/src/lib/utils";
import { ensureDir, writeJSON } from "fs-extra";
import { join } from "path";
import { GraphQLObjectTypes } from "@skylark-apps/skylarktv/src/lib/interfaces";
import {
  FetchedLegacyObjects,
  LegacyObjectType,
  LegacyObjects,
  ParsedSL8Credits,
} from "./types/legacySkylark";
import { createOrUpdateGraphQlObjectsUsingIntrospection } from "../skylark/saas/create";
import { GraphQLBaseObject } from "../interfaces";
import { getExistingObjects } from "../skylark/saas/get";
import { ConvertedLegacyObject, CreatedSkylarkObjects } from "./types/skylark";
import { createRelationships } from "./skylarkRelationships";
import {
  convertLegacyObjectTypeToObjectType,
  getLegacyUidFromUrl,
} from "./utils";
import { assignAvailabilitiesToObjects } from "../skylark/saas/availability";

const getExistingObjectsForAllLanguages = async (
  objectType: GraphQLObjectTypes,
  languages: string[],
  objects: Record<string, LegacyObjects | ParsedSL8Credits[]>,
) => {
  const existingExternalIds = new Set<string>([]);
  const missingExternalIds = new Set<string>([]);

  let existingObjects: Record<string, GraphQLBaseObject> = {};
  const existingObjectsPerLanguage: Record<
    string,
    Record<string, GraphQLBaseObject>
  > = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const language of languages) {
    if (!hasProperty(objects, language)) {
      break;
    }

    const externalIds = objects[language].map(({ uid }) => ({
      externalId: uid,
    }));

    const {
      existingExternalIds: existing,
      missingExternalIds: missing,
      existingObjects: existingObjs,
    } =
      // eslint-disable-next-line no-await-in-loop
      await getExistingObjects(objectType, externalIds, language);

    existingObjectsPerLanguage[language] = existingObjs;

    existing.forEach((item) => existingExternalIds.add(item));
    missing.forEach((item) => missingExternalIds.add(item));

    existingObjects = {
      ...existingObjects,
      ...existingObjs,
    };
  }

  return {
    existingExternalIds,
    missingExternalIds,
    existingObjects,
    existingObjectsPerLanguage,
  };
};

export const createObjectsInSkylark = async (
  {
    type,
    objects: legacyObjectsAndLanguage,
  }: {
    type: LegacyObjectType;
    objects: Record<string, LegacyObjects | ParsedSL8Credits[]>;
  },
  args: {
    relationshipObjects: CreatedSkylarkObjects;
    legacyObjectConverter: (
      legacyObject: LegacyObjects[0] | ParsedSL8Credits,
      language?: string,
    ) => ConvertedLegacyObject | null;
    legacyCredits?: FetchedLegacyObjects<ParsedSL8Credits>;
    isCreateOnly?: boolean;
    alwaysAvailability?: GraphQLBaseObject;
    availabilities?: GraphQLBaseObject[];
  },
): Promise<GraphQLBaseObject[]> => {
  const { relationshipObjects, legacyObjectConverter, ...opts } = args;

  const objectType = convertLegacyObjectTypeToObjectType(type);

  const totalObjectsToBeCreatedUpdated = Object.values(
    legacyObjectsAndLanguage,
  ).reduce((previous, arr) => previous + arr.length, 0);
  // eslint-disable-next-line no-console
  console.log(
    `--- ${objectType}s creating/updating: ${totalObjectsToBeCreatedUpdated}`,
  );

  const languages = Object.keys(legacyObjectsAndLanguage);

  if (languages.length === 0) {
    return [];
  }

  // eslint-disable-next-line prefer-const
  let { existingExternalIds, missingExternalIds, existingObjectsPerLanguage } =
    await getExistingObjectsForAllLanguages(
      objectType,
      languages,
      legacyObjectsAndLanguage,
    );

  // TODO remove this, just for debugging
  await ensureDir(join(__dirname, "outputs", "existingObjects"));
  await writeJSON(
    join(__dirname, "outputs", "existingObjects", `${objectType}.json`),
    {
      existingExternalIds: [...existingExternalIds],
      missingExternalIds: [...missingExternalIds],
      count: {
        existingObjects: existingExternalIds.size,
        missingObjects: missingExternalIds.size,
      },
    },
  );

  let accaArr: GraphQLBaseObject[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const language of languages) {
    const legacyObjects = legacyObjectsAndLanguage[language];
    const parsedLegacyObjects = legacyObjects
      .map((obj) => legacyObjectConverter(obj, language))
      .filter((obj): obj is ConvertedLegacyObject => !!obj);

    const relationships: Record<string, Record<string, { link: string[] }>> = (
      legacyObjects as LegacyObjects[0][]
    ).reduce((previous, obj) => {
      const objRelationships = createRelationships(obj, relationshipObjects);

      if (!objRelationships) {
        return previous;
      }

      return {
        ...previous,
        [obj.uid]: objRelationships,
      };
    }, {});

    const availabilitiesToAdd: Record<string, string[]> =
      opts.availabilities || opts.alwaysAvailability
        ? (legacyObjects as LegacyObjects[0][]).reduce((previous, obj) => {
            const legacyUids = obj.schedule_urls?.map(getLegacyUidFromUrl);

            if (!legacyUids) {
              return opts.alwaysAvailability
                ? { ...previous, [obj.uid]: [opts.alwaysAvailability.uid] }
                : previous;
            }

            const uids = legacyUids
              .map((legacyUid) => {
                const availability = opts.availabilities?.find(
                  ({ external_id }) => external_id === legacyUid,
                );
                return availability?.uid;
              })
              .filter((str): str is string => !!str);

            if (opts.alwaysAvailability) {
              uids.push(opts.alwaysAvailability.uid);
            }

            return {
              ...previous,
              [obj.uid]: uids,
            };
          }, {})
        : {};

    // If in create only mode, get External IDs of existing objects for this language
    const previouslyCreatedObjectExternalIdsForThisLanguage =
      opts?.isCreateOnly && existingObjectsPerLanguage[language]
        ? new Set(
            Object.values(existingObjectsPerLanguage[language]).map(
              ({ external_id }) => external_id,
            ),
          )
        : null;
    if (previouslyCreatedObjectExternalIdsForThisLanguage) {
      // eslint-disable-next-line no-console
      console.log(
        `    - ${language.toLowerCase()}: ${
          previouslyCreatedObjectExternalIdsForThisLanguage.size
        } existing`,
      );
    }

    // If in create only mode, filter out any existing objects
    const objectsToCreate = parsedLegacyObjects
      .filter((obj) =>
        previouslyCreatedObjectExternalIdsForThisLanguage
          ? !previouslyCreatedObjectExternalIdsForThisLanguage.has(
              obj.external_id,
            )
          : true,
      )
      .map((obj) => ({
        ...obj,
        _id: obj.external_id,
        language,
      }));

    const {
      createdObjects: createdLanguageObjects,
      deletedObjects: deletedLanguageObjects,
    } =
      // eslint-disable-next-line no-await-in-loop
      await createOrUpdateGraphQlObjectsUsingIntrospection(
        objectType,
        existingExternalIds,
        objectsToCreate,
        { language, relationships, availabilities: availabilitiesToAdd },
      );

    accaArr.push(...createdLanguageObjects);

    if (deletedLanguageObjects.length > 0) {
      const deletedUids = new Set(deletedLanguageObjects.map(({ uid }) => uid));
      accaArr = accaArr.filter(({ uid }) => !deletedUids.has(uid));
    }

    // eslint-disable-next-line no-console
    console.log(
      `    - ${language.toLowerCase()}: ${
        createdLanguageObjects.length
      } objects`,
    );

    const newExternalIds = createdLanguageObjects.map(
      ({ external_id }) => external_id,
    );

    existingExternalIds = new Set<string>([
      ...existingExternalIds,
      ...newExternalIds,
    ]);
  }

  const createdObjects = accaArr.flatMap((a) => a);

  const uniqueBaseObjects = createdObjects.filter(
    (a, index, self) =>
      index ===
      self.findIndex((b) => a.uid === b.uid && a.external_id === b.external_id),
  );

  // eslint-disable-next-line no-console
  console.log(
    `    - created/updated: ${createdObjects.length} (${uniqueBaseObjects.length} unique)`,
  );

  return uniqueBaseObjects;
};

export const addAlwaysAvailabilityToObjects = async (
  alwaysAvailability: GraphQLBaseObject,
  legacyObjects: {
    type: LegacyObjectType;
    objects: Record<string, LegacyObjects>;
    totalFound: number;
  }[],
  languages: string[],
) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const legacyObject of legacyObjects) {
    const objectType = convertLegacyObjectTypeToObjectType(legacyObject.type);
    // eslint-disable-next-line no-console
    console.log(`--- Adding Availability to ${objectType}`);

    // eslint-disable-next-line no-await-in-loop
    const { existingObjects } = await getExistingObjectsForAllLanguages(
      objectType,
      languages,
      legacyObject.objects,
    );

    const uniqueUids: string[] = [
      ...new Set(
        Object.values(existingObjects)
          .flatMap((arr) => arr)
          .map(({ uid }) => uid),
      ),
    ] as string[];

    // eslint-disable-next-line no-await-in-loop
    await assignAvailabilitiesToObjects(
      [alwaysAvailability],
      objectType,
      uniqueUids,
    );
  }
};
