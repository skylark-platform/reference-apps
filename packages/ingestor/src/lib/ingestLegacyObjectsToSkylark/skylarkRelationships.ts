import { GraphQLSetObjectTypes } from "@skylark-apps/skylarktv/src/lib/interfaces";
import { GraphQLBaseObject } from "../interfaces";
import { generateSL8CreditUid } from "./legacy";
import {
  FetchedLegacyObjects,
  LegacyAsset,
  LegacyBrand,
  LegacyEpisode,
  LegacyObjects,
  LegacyObjectType,
  LegacyObjectUidPrefix,
  LegacySeason,
  LegacySet,
  LegacySetItem,
  ParsedSL8Credits,
} from "./types/legacySkylark";
import { CreatedSkylarkObjects } from "./types/skylark";
import {
  convertLegacyObjectTypeToObjectType,
  getLegacyObjectTypeFromUrl,
  getLegacyUidFromUrl,
} from "./utils";
import { addContentToCreatedSets } from "../skylark/saas/sets";

const getUidsFromExtIds = (
  extIds: string[],
  objects: GraphQLBaseObject[],
): string[] => {
  const uids = extIds
    .map((extId) => objects.find(({ external_id }) => extId === external_id))
    .filter((obj): obj is GraphQLBaseObject => !!obj)
    .map(({ uid }) => uid);

  const uniqueUids = [...new Set(uids)] as string[];

  return uniqueUids;
};

const getUidsFromUrls = (
  urls: string[],
  objects: GraphQLBaseObject[],
  prefix: string,
) => {
  const extIds = urls
    .map(getLegacyUidFromUrl)
    .filter((extId) => extId.startsWith(prefix));
  const uids = getUidsFromExtIds(extIds, objects);

  return uids;
};

const getUidsFromItems = (
  items: string[] | LegacySetItem[],
  objects: GraphQLBaseObject[],
  prefix: string,
) => {
  if (items.length === 0) {
    return [];
  }

  if (typeof items[0] === "string") {
    return getUidsFromUrls(items as string[], objects, prefix);
  }

  const contentUrls = (items as LegacySetItem[]).map((obj) => obj.content_url);
  return getUidsFromUrls(contentUrls, objects, prefix);
};

const getTags = (
  legacyObject: LegacyBrand | LegacyAsset | LegacyEpisode | LegacySeason,
  skylarkTags: GraphQLBaseObject[],
) => {
  const legacyTagExtIds = legacyObject.tags.map(({ tag_url }) =>
    getLegacyUidFromUrl(tag_url),
  );
  const tagUids = getUidsFromExtIds(legacyTagExtIds, skylarkTags);

  return tagUids;
};

const getCredits = (
  legacyObject:
    | LegacyBrand
    | LegacyAsset
    | LegacyEpisode
    | LegacySeason
    | LegacySet,
  skylarkCredits: GraphQLBaseObject[],
) => {
  const creditUids =
    legacyObject.credits
      ?.map((credit) => {
        const externalId = generateSL8CreditUid(
          credit.people_url,
          credit.role_url,
          credit.character,
        );
        const createdCredit = skylarkCredits.find(
          ({ external_id }) => external_id === externalId,
        );
        return createdCredit?.uid;
      })
      .filter((credit): credit is string => !!credit) || [];
  return creditUids;
};

export const createRelationships = (
  legacyObject: LegacyObjects[0] | ParsedSL8Credits,
  relationshipObjects: CreatedSkylarkObjects,
): Record<string, { link: string[] }> | undefined => {
  // eslint-disable-next-line no-underscore-dangle
  const legacyObjectType = legacyObject._type;
  const legacyUid = legacyObject.uid;
  if (!legacyObjectType) {
    throw new Error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `[createRelationships] Unknown legacy object type: ${legacyUid}`,
    );
  }

  // {relationships: {tag_categories: {link: ""}}}

  if (legacyObjectType === LegacyObjectType.TagCategories) {
    return undefined;
  }

  const relationships: Record<string, { link: string[] }> = {};

  // TAG CATEGORIES
  if (
    legacyObjectType === LegacyObjectType.Tags &&
    relationshipObjects.tagCategories.length > 0
  ) {
    const categoryExtId = getLegacyUidFromUrl(legacyObject.category_url);
    const createdCategory = relationshipObjects.tagCategories.find(
      ({ external_id }) => external_id === categoryExtId,
    );
    return {
      tag_categories: {
        link: createdCategory ? [createdCategory.uid] : [],
      },
    };
  }

  // TAGS
  if (
    LegacyObjectType.Assets === legacyObjectType ||
    LegacyObjectType.Games === legacyObjectType ||
    LegacyObjectType.Brands === legacyObjectType ||
    LegacyObjectType.Episodes === legacyObjectType ||
    LegacyObjectType.Seasons === legacyObjectType
  ) {
    const tagUids = getTags(legacyObject, relationshipObjects.tags);
    relationships.tags = { link: tagUids };
  }

  // IMAGES
  if (
    LegacyObjectType.Ratings === legacyObjectType ||
    LegacyObjectType.People === legacyObjectType ||
    LegacyObjectType.Genres === legacyObjectType ||
    LegacyObjectType.Assets === legacyObjectType ||
    LegacyObjectType.Games === legacyObjectType ||
    LegacyObjectType.Brands === legacyObjectType ||
    LegacyObjectType.Episodes === legacyObjectType ||
    LegacyObjectType.Seasons === legacyObjectType ||
    LegacyObjectType.Sets === legacyObjectType
  ) {
    const imageUids = getUidsFromUrls(
      legacyObject.image_urls || [],
      relationshipObjects.images,
      LegacyObjectUidPrefix.Image,
    );
    relationships.images = { link: imageUids };
  }

  // GENRES
  if (
    LegacyObjectType.Assets === legacyObjectType ||
    LegacyObjectType.Games === legacyObjectType ||
    LegacyObjectType.Brands === legacyObjectType ||
    LegacyObjectType.Episodes === legacyObjectType ||
    LegacyObjectType.Seasons === legacyObjectType ||
    LegacyObjectType.Sets === legacyObjectType
  ) {
    const genreUids = getUidsFromUrls(
      legacyObject.genre_urls || [],
      relationshipObjects.genres,
      LegacyObjectUidPrefix.Genre,
    );
    relationships.genres = { link: genreUids };
  }

  // RATINGS
  if (
    LegacyObjectType.Assets === legacyObjectType ||
    LegacyObjectType.Games === legacyObjectType ||
    LegacyObjectType.Brands === legacyObjectType ||
    LegacyObjectType.Episodes === legacyObjectType ||
    LegacyObjectType.Seasons === legacyObjectType ||
    LegacyObjectType.Sets === legacyObjectType
  ) {
    const ratingUids = getUidsFromUrls(
      legacyObject.rating_urls || [],
      relationshipObjects.ratings,
      LegacyObjectUidPrefix.Rating,
    );
    relationships.ratings = { link: ratingUids };
  }

  // CREDITS
  if (
    LegacyObjectType.Assets === legacyObjectType ||
    LegacyObjectType.Games === legacyObjectType ||
    LegacyObjectType.Brands === legacyObjectType ||
    LegacyObjectType.Episodes === legacyObjectType ||
    LegacyObjectType.Seasons === legacyObjectType ||
    LegacyObjectType.Sets === legacyObjectType
  ) {
    const creditUids = getCredits(legacyObject, relationshipObjects.credits);
    relationships.credits = { link: creditUids };
  }

  // ASSETS
  if (
    LegacyObjectType.Brands === legacyObjectType ||
    LegacyObjectType.Episodes === legacyObjectType ||
    LegacyObjectType.Seasons === legacyObjectType
  ) {
    const assetUids = getUidsFromItems(
      legacyObject.items,
      relationshipObjects.assets,
      LegacyObjectUidPrefix.Asset,
    );
    relationships.assets = { link: assetUids };
  }

  // EPISODES
  if (
    LegacyObjectType.Brands === legacyObjectType ||
    LegacyObjectType.Seasons === legacyObjectType
  ) {
    const episodeUids = getUidsFromItems(
      legacyObject.items,
      relationshipObjects.episodes,
      LegacyObjectUidPrefix.Episode,
    );
    relationships.episodes = { link: episodeUids };
  }

  // SEASONS
  if (LegacyObjectType.Brands === legacyObjectType) {
    const seasonUids = getUidsFromItems(
      legacyObject.items,
      relationshipObjects.seasons,
      LegacyObjectUidPrefix.Season,
    );
    relationships.seasons = { link: seasonUids };
  }

  // [CREDITS SPECIFIC]: ROLES & PEOPLE
  if (LegacyObjectType.Credits === legacyObjectType) {
    relationships.people = {
      link: getUidsFromUrls(
        [legacyObject.people_url],
        relationshipObjects.people,
        LegacyObjectUidPrefix.People,
      ),
    };
    relationships.roles = {
      link: getUidsFromUrls(
        [legacyObject.role_url],
        relationshipObjects.roles,
        LegacyObjectUidPrefix.Role,
      ),
    };
  }

  return relationships;
};

export const createSetContent = async (
  createdSets: GraphQLBaseObject[],
  legacySets: FetchedLegacyObjects<LegacySet>,
  createdObjects: CreatedSkylarkObjects,
) => {
  const allCreatedObjects = Object.values(createdObjects).flatMap((arr) => arr);

  const createdSetsWithContent = createdSets.map((set) => {
    const legacySet = Object.values(legacySets.objects)
      .flatMap((arr) => arr)
      .find(({ uid }) => uid === set.external_id);

    if (!legacySet) {
      return {
        ...set,
        content: [],
      };
    }

    const content = legacySet.items.map((item) => {
      const externalId = getLegacyUidFromUrl(item.content_url);
      const legacyObjectType = getLegacyObjectTypeFromUrl(item.content_url);

      const objectType = convertLegacyObjectTypeToObjectType(legacyObjectType);

      const createdItemObject = allCreatedObjects.find(
        ({ external_id }) => external_id === externalId,
      );
      if (!createdItemObject) {
        throw new Error(
          `[createSetContent] Set content item not found in createdObjects array`,
        );
      }

      return {
        uid: createdItemObject.uid,
        objectType,
        position: item.position,
      };
    });

    return {
      ...set,
      content,
    };
  });

  if (!process.env.CUSTOM_SET_OBJECT_TYPE) {
    throw new Error(
      `[createSetContent] process.env.CUSTOM_SET_OBJECT_TYPE cannot be empty`,
    );
  }

  // Change to actual Set
  await addContentToCreatedSets(
    process.env.CUSTOM_SET_OBJECT_TYPE as GraphQLSetObjectTypes,
    createdSetsWithContent,
  );
};
