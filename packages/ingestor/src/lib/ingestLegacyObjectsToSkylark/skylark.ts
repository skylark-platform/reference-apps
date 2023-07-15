import { GraphQLObjectTypes, hasProperty } from "@skylark-reference-apps/lib";
import { ensureDir, writeJSON } from "fs-extra";
import { join } from "path";
import {
  LegacyObjectType,
  LegacyObjects,
  LegacyObjectsWithSynopsis,
} from "./types/legacySkylark";
import { createOrUpdateGraphQlObjectsUsingIntrospection } from "../skylark/saas/create";
import { GraphQLBaseObject } from "../interfaces";
import { getExistingObjects } from "../skylark/saas/get";
import { CreatedSkylarkObjects } from "./types/skylark";
import { createRelationships } from "./skylarkRelationships";
import { ASSET_TYPES_TO_IGNORE } from "./constants";
import { convertLegacyObjectTypeToObjectType } from "./utils";
import { assignAvailabilitiesToObjects } from "../skylark/saas/availability";

type ConvertedLegacyObject = { external_id: string } & Record<
  string,
  string | null | string[] | boolean | number | object
>;

const getSynopsisForMedia = (legacyObject: LegacyObjectsWithSynopsis) => {
  // We want to make sure that we add synopsis, then short_synopsis in the order alternate_synopsis -> synopsis -> extended_synopsis
  const synopsis =
    legacyObject.alternate_synopsis ||
    legacyObject.synopsis ||
    legacyObject.extended_synopsis;
  const synopsisShort =
    (synopsis && synopsis !== legacyObject.synopsis && legacyObject.synopsis) ||
    (synopsis !== legacyObject.extended_synopsis &&
      legacyObject.extended_synopsis) ||
    "";

  return {
    synopsis,
    synopsisShort,
  };
};

const convertLegacyObject = (
  legacyObject: LegacyObjects[0]
): ConvertedLegacyObject | null => {
  // eslint-disable-next-line no-underscore-dangle
  const legacyObjectType = legacyObject._type;
  const legacyUid = legacyObject.uid;
  if (!legacyObjectType) {
    throw new Error(
      `[convertLegacyObject] Unknown legacy object type: ${legacyUid}`
    );
  }

  const commonFields = {
    ...legacyObject, // By adding the whole legacy object to each object, the introspection create will add any missing fields that are
    external_id: legacyObject.uid,
  };

  if (legacyObjectType === LegacyObjectType.Assets) {
    const assetType = legacyObject.asset_type_url?.name || null;
    if (assetType && ASSET_TYPES_TO_IGNORE.includes(assetType)) {
      return null;
    }
    const { synopsis, synopsisShort } = getSynopsisForMedia(legacyObject);

    return {
      ...commonFields,
      internal_title: legacyObject.name,
      title: legacyObject.title,
      synopsis,
      synopsis_short: synopsisShort,
      type: assetType,
      duration: legacyObject.duration_in_seconds,
      url: legacyObject.url !== "" ? legacyObject.url : null,
      // state: legacyObject.state, Can't add this to SkylarkAsset
    };
  }

  if (legacyObjectType === LegacyObjectType.Episodes) {
    const { synopsis, synopsisShort } = getSynopsisForMedia(legacyObject);
    return {
      ...commonFields,
      internal_title: legacyObject.name,
      title: legacyObject.title,
      synopsis,
      synopsis_short: synopsisShort,
      episode_number: legacyObject.episode_number,
      kaltura_id: legacyObject.new_flag,
    };
  }

  if (legacyObjectType === LegacyObjectType.Seasons) {
    const { synopsis, synopsisShort } = getSynopsisForMedia(legacyObject);

    return {
      ...commonFields,
      internal_title: legacyObject.name,
      title: legacyObject.title,
      synopsis,
      synopsis_short: synopsisShort,
      season_number: legacyObject.season_number,
      number_of_episodes: legacyObject.number_of_episodes,
    };
  }

  if (legacyObjectType === LegacyObjectType.Brands) {
    const { synopsis, synopsisShort } = getSynopsisForMedia(legacyObject);

    return {
      ...commonFields,
      internal_title: legacyObject.name,
      title: legacyObject.title,
      synopsis,
      synopsis_short: synopsisShort,
    };
  }

  return commonFields;
};

const getExistingObjectsForAllLanguages = async (
  objectType: GraphQLObjectTypes,
  languages: string[],
  objects: Record<string, LegacyObjects>
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
    objects: Record<string, LegacyObjects>;
  },
  relationshipObjects: CreatedSkylarkObjects,
  opts?: { isCreateOnly?: boolean; alwaysAvailability?: GraphQLBaseObject }
): Promise<GraphQLBaseObject[]> => {
  const objectType = convertLegacyObjectTypeToObjectType(type);

  const totalObjectsToBeCreatedUpdated = Object.values(
    legacyObjectsAndLanguage
  ).reduce((previous, arr) => previous + arr.length, 0);
  // eslint-disable-next-line no-console
  console.log(
    `--- ${objectType}s creating/updating: ${totalObjectsToBeCreatedUpdated}`
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
      legacyObjectsAndLanguage
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
    }
  );

  let accaArr: GraphQLBaseObject[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const language of languages) {
    const legacyObjects = legacyObjectsAndLanguage[language];
    const parsedLegacyObjects = legacyObjects
      .map(convertLegacyObject)
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

    // If in create only mode, get External IDs of existing objects for this language
    const previouslyCreatedObjectExternalIdsForThisLanguage =
      opts?.isCreateOnly && existingObjectsPerLanguage[language]
        ? new Set(
            Object.values(existingObjectsPerLanguage[language]).map(
              ({ external_id }) => external_id
            )
          )
        : null;
    if (previouslyCreatedObjectExternalIdsForThisLanguage) {
      // eslint-disable-next-line no-console
      console.log(
        `    - ${language.toLowerCase()}: ${
          previouslyCreatedObjectExternalIdsForThisLanguage.size
        } existing`
      );
    }

    // If in create only mode, filter out any existing objects
    const objectsToCreate = parsedLegacyObjects
      .filter((obj) =>
        previouslyCreatedObjectExternalIdsForThisLanguage
          ? !previouslyCreatedObjectExternalIdsForThisLanguage.has(
              obj.external_id
            )
          : true
      )
      .map((obj) => ({
        ...obj,
        _id: obj.external_id,
        language,
      }));

    const availabilityUids = opts?.alwaysAvailability
      ? [opts.alwaysAvailability.uid]
      : [];

    const {
      createdObjects: createdLanguageObjects,
      deletedObjects: deletedLanguageObjects,
    } =
      // eslint-disable-next-line no-await-in-loop
      await createOrUpdateGraphQlObjectsUsingIntrospection(
        objectType,
        existingExternalIds,
        objectsToCreate,
        { language, relationships, availabilityUids }
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
      } objects`
    );

    const newExternalIds = createdLanguageObjects.map(
      ({ external_id }) => external_id
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
      self.findIndex((b) => a.uid === b.uid && a.external_id === b.external_id)
  );

  // eslint-disable-next-line no-console
  console.log(
    `    - created/updated: ${createdObjects.length} (${uniqueBaseObjects.length} unique)`
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
  languages: string[]
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
      legacyObject.objects
    );

    const uniqueUids: string[] = [
      ...new Set(
        Object.values(existingObjects)
          .flatMap((arr) => arr)
          .map(({ uid }) => uid)
      ),
    ] as string[];

    // eslint-disable-next-line no-await-in-loop
    await assignAvailabilitiesToObjects(
      [alwaysAvailability],
      objectType,
      uniqueUids
    );
  }
};
