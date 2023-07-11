import { GraphQLObjectTypes } from "@skylark-reference-apps/lib";
import { ensureDir, writeJSON } from "fs-extra";
import { join } from "path";
import {
  LegacyAsset,
  LegacyBrand,
  LegacyEpisode,
  LegacyObjectType,
  LegacyObjects,
  LegacySeason,
} from "./types/legacySkylark";
import { createOrUpdateGraphQlObjectsUsingIntrospection } from "../skylark/saas/create";
import { GraphQLBaseObject } from "../interfaces";
import { getExistingObjects } from "../skylark/saas/get";
import { CreatedSkylarkObjects } from "./types/skylark";
import { createRelationships } from "./skylarkRelationships";
import { ASSET_TYPES_TO_IGNORE } from "./constants";

type ConvertedLegacyObject = { external_id: string } & Record<
  string,
  string | null | string[] | boolean | number | object
>;

const convertLegacyObjectTypeToObjectType = (
  legacyType: LegacyObjectType
): GraphQLObjectTypes => {
  switch (legacyType) {
    case LegacyObjectType.TagCategories:
      return "TagCategory";
    case LegacyObjectType.Tags:
      return "SkylarkTag";
    case LegacyObjectType.Assets:
      return "SkylarkAsset";
    case LegacyObjectType.Episodes:
      return "Episode";
    case LegacyObjectType.Seasons:
      return "Season";
    case LegacyObjectType.Brands:
      return "Brand";
    default:
      throw new Error("[convertLegacyObjectTypeToObjectType] Unknown type");
  }
};

const getSynopsisForMedia = (
  legacyObject: LegacyEpisode | LegacyBrand | LegacySeason | LegacyAsset
) => {
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
  const existingObjects = new Set<string>([]);
  const missingObjects = new Set<string>([]);

  // eslint-disable-next-line no-restricted-syntax
  for (const language of languages) {
    const externalIds = objects[language].map(({ uid }) => ({
      externalId: uid,
    }));

    const { existingObjects: existing, missingObjects: missing } =
      // eslint-disable-next-line no-await-in-loop
      await getExistingObjects(objectType, externalIds, language);

    existing.forEach((item) => existingObjects.add(item));
    missing.forEach((item) => missingObjects.add(item));
  }

  return { existingObjects, missingObjects };
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
  alwaysAvailability: GraphQLBaseObject
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
  let { existingObjects, missingObjects } =
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
      existingObjects: [...existingObjects],
      missingObjects: [...missingObjects],
      count: {
        existingObjects: existingObjects.size,
        missingObjects: missingObjects.size,
      },
    }
  );

  const accaArr: GraphQLBaseObject[][] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const language of languages) {
    // Fetch existing Ids inside language loop so that we recognise one is added if its added new in the same ingest run

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

    const objectsToCreate = parsedLegacyObjects.map((obj) => ({
      ...obj,
      _id: obj.external_id,
      language,
    }));

    // TODO enable availability after fix
    // const availabilityUids = [alwaysAvailability.uid];

    const createdLanguageObjects =
      // eslint-disable-next-line no-await-in-loop
      await createOrUpdateGraphQlObjectsUsingIntrospection(
        objectType,
        existingObjects,
        objectsToCreate,
        // { language, relationships, availabilityUids }
        { language, relationships }
      );

    accaArr.push(createdLanguageObjects);

    // eslint-disable-next-line no-console
    console.log(
      `    - ${language.toLowerCase()}: ${
        createdLanguageObjects.length
      } objects`
    );

    const newExternalIds = createdLanguageObjects.map(
      ({ external_id }) => external_id
    );
    // existingObjects.push(...newExternalIds); // No issue with there being duplicates in this array as we're only using it to find existing and we filter duplicates out when generating relationships

    existingObjects = new Set<string>([...existingObjects, ...newExternalIds]);
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
