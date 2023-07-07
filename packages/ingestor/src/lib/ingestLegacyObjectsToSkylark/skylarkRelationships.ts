import { GraphQLBaseObject } from "../interfaces";
import {
  LegacyAsset,
  LegacyBrand,
  LegacyEpisode,
  LegacyObjects,
  LegacyObjectType,
  LegacySeason,
} from "./types/legacySkylark";
import { CreatedSkylarkObjects } from "./types/skylark";

const getLegacyUidFromUrl = (url: string) => {
  // e.g. /api/tag-categories/cate_44ef19d0f44a4775af16bf7cf35f25b9/
  const uid = url.split("/")?.[3];
  if (!uid) {
    throw new Error(`Unable to parse legacy UID from "${url}"`);
  }
  return uid;
};

const getTags = (
  legacyObject: LegacyAsset | LegacyEpisode | LegacySeason | LegacyBrand,
  skylarkTags: GraphQLBaseObject[]
) => {
  const legacyTagExtIds = legacyObject.tags.map(({ tag_url }) => tag_url);
  const tags = legacyTagExtIds
    .map((extId) => skylarkTags.find((tag) => tag.external_id === extId))
    .filter((tag): tag is GraphQLBaseObject => !!tag);
  const tagUids = tags.map(({ uid }) => uid);

  return tagUids;
};

export const createRelationships = (
  legacyObject: LegacyObjects[0],
  relationshipObjects: CreatedSkylarkObjects
): Record<string, { link: string[] }> | undefined => {
  // eslint-disable-next-line no-underscore-dangle
  const legacyObjectType = legacyObject._type;
  const legacyUid = legacyObject.uid;
  if (!legacyObjectType) {
    throw new Error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `[convertLegacyObject] Unknown legacy object type: ${legacyUid}`
    );
  }

  // {relationships: {tag_categories: {link: ""}}}

  if (legacyObjectType === LegacyObjectType.TagCategories) {
    return undefined;
  }

  if (legacyObjectType === LegacyObjectType.Tags) {
    const categoryExtId = getLegacyUidFromUrl(legacyObject.category_url);
    const createdCategory = relationshipObjects.tagCategories.find(
      ({ external_id }) => external_id === categoryExtId
    );
    return {
      tag_categories: {
        link: createdCategory ? [createdCategory.uid] : [],
      },
    };
  }

  if (legacyObjectType === LegacyObjectType.Assets) {
    const tagUids = getTags(legacyObject, relationshipObjects.tags);
    return {
      tags: {
        link: tagUids,
      },
    };
  }

  if (legacyObjectType === LegacyObjectType.Episodes) {
    const tagUids = getTags(legacyObject, relationshipObjects.tags);
    return {
      tags: {
        link: tagUids,
      },
    };
  }

  if (legacyObjectType === LegacyObjectType.Seasons) {
    const tagUids = getTags(legacyObject, relationshipObjects.tags);
    return {
      tags: {
        link: tagUids,
      },
    };
  }

  if (legacyObjectType === LegacyObjectType.Brands) {
    const tagUids = getTags(legacyObject, relationshipObjects.tags);
    return {
      tags: {
        link: tagUids,
      },
    };
  }

  return undefined;
};
