import { GraphQLBaseObject } from "../interfaces";
import {
  LegacyAsset,
  LegacyBrand,
  LegacyEpisode,
  LegacyObjects,
  LegacyObjectType,
  LegacyObjectUidPrefix,
  LegacySeason,
} from "./types/legacySkylark";
import { CreatedSkylarkObjects } from "./types/skylark";

const getLegacyUidFromUrl = (url: string) => {
  if (!url.includes("/")) {
    throw new Error(
      `[getLegacyUidFromUrl] URL does not contain array separator" ${url}`
    );
  }

  // e.g. /api/tag-categories/cate_44ef19d0f44a4775af16bf7cf35f25b9/
  const uid = url.split("/")?.[3];
  if (!uid) {
    throw new Error(
      `[getLegacyUidFromUrl] Unable to parse legacy UID from "${url}"`
    );
  }
  return uid;
};

const getUidsFromExtIds = (extIds: string[], objects: GraphQLBaseObject[]) => {
  const uids = extIds
    .map((extId) => objects.find(({ external_id }) => extId === external_id))
    .filter((obj): obj is GraphQLBaseObject => !!obj)
    .map(({ uid }) => uid);

  return uids;
};

const getUidsFromUrls = (
  urls: string[],
  objects: GraphQLBaseObject[],
  prefix: string
) => {
  const extIds = urls
    .map(getLegacyUidFromUrl)
    .filter((extId) => extId.startsWith(prefix));
  const uids = getUidsFromExtIds(extIds, objects);

  return uids;
};

const getTags = (
  legacyObject: LegacyAsset | LegacyEpisode | LegacySeason | LegacyBrand,
  skylarkTags: GraphQLBaseObject[]
) => {
  const legacyTagExtIds = legacyObject.tags.map(({ tag_url }) =>
    getLegacyUidFromUrl(tag_url)
  );
  const tagUids = getUidsFromExtIds(legacyTagExtIds, skylarkTags);

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

    const assetUids = getUidsFromUrls(
      legacyObject.items,
      relationshipObjects.assets,
      LegacyObjectUidPrefix.Asset
    );
    return {
      tags: {
        link: tagUids,
      },
      assets: {
        link: assetUids,
      },
    };
  }

  if (legacyObjectType === LegacyObjectType.Seasons) {
    const tagUids = getTags(legacyObject, relationshipObjects.tags);

    const assetUids = getUidsFromUrls(
      legacyObject.items,
      relationshipObjects.assets,
      LegacyObjectUidPrefix.Asset
    );

    const episodeUids = getUidsFromUrls(
      legacyObject.items,
      relationshipObjects.episodes,
      LegacyObjectUidPrefix.Episode
    );
    return {
      tags: {
        link: tagUids,
      },
      assets: {
        link: assetUids,
      },
      episodes: {
        link: episodeUids,
      },
    };
  }

  if (legacyObjectType === LegacyObjectType.Brands) {
    const tagUids = getTags(legacyObject, relationshipObjects.tags);

    const assetUids = getUidsFromUrls(
      legacyObject.items,
      relationshipObjects.assets,
      LegacyObjectUidPrefix.Asset
    );

    const episodeUids = getUidsFromUrls(
      legacyObject.items,
      relationshipObjects.episodes,
      LegacyObjectUidPrefix.Episode
    );

    const seasonUids = getUidsFromUrls(
      legacyObject.items,
      relationshipObjects.seasons,
      LegacyObjectUidPrefix.Season
    );

    return {
      tags: {
        link: tagUids,
      },
      assets: {
        link: assetUids,
      },
      episodes: {
        link: episodeUids,
      },
      seasons: {
        link: seasonUids,
      },
      // TODO confirm this is needed. Implementation is a bit tricky
      // brands: {
      //   link: brandUids,
      // },
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
