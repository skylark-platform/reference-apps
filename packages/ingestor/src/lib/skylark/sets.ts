import {
  ApiDynamicObject,
  ApiEntertainmentObject,
  ApiSetItem,
  SetTypes,
} from "@skylark-reference-apps/lib";
import { FieldSet } from "airtable";
import { SetConfig, Metadata } from "../../interfaces";
import { authenticatedSkylarkRequest } from "./api";
import { parseAirtableImagesAndUploadToSkylark } from "./create";
import { getResourceByName, getResourceBySlug } from "./get";

/**
 * getSetBySlug - Queries a Skylark set using a slug
 * @param setType - the set type
 * @param slug - query slug
 * @returns The first object returned, otherwise null if none are found
 */
export const getSetBySlug = async (
  setType: SetTypes,
  slug: string
): Promise<ApiEntertainmentObject | null> => {
  const res = await authenticatedSkylarkRequest<{
    objects?: ApiEntertainmentObject[];
  }>(`/api/sets/?set_type_slug=${setType}&slug=${slug}`, {
    method: "GET",
    params: {
      all: true,
    },
  });

  return res.data.objects?.[0] || null;
};

export const getSetItems = async (setUid: string) => {
  const url = `/api/sets/${setUid}/items/`;
  const res = await authenticatedSkylarkRequest<{ objects: ApiSetItem[] }>(
    url,
    {
      method: "GET",
      params: {
        all: true,
      },
    }
  );
  return res.data.objects;
};

export const createOrUpdateSet = async (
  setConfig: SetConfig,
  metadata: Metadata,
  additionalProperties?: FieldSet
) => {
  const { title, slug, set_type_slug: setTypeSlug } = setConfig;
  const setType = metadata.set.types.find(
    ({ slug: metadataSlug }) => metadataSlug === setTypeSlug
  );

  const existingSet = await getResourceBySlug<ApiEntertainmentObject>(
    "sets",
    slug
  );

  const url = existingSet ? `/api/sets/${existingSet.uid}` : `/api/sets/`;
  const { data: set } =
    await authenticatedSkylarkRequest<ApiEntertainmentObject>(url, {
      method: existingSet ? "PUT" : "POST",
      data: {
        ...existingSet,
        ...additionalProperties,
        title,
        slug,
        schedule_urls: [metadata.schedules.always.self],
        set_type_url: setType?.self,
      },
    });

  return set;
};

export const createOrUpdateSetItem = async (
  setUid: string,
  contentUrl: string,
  position: number,
  existingSetItems: ApiSetItem[],
  metadata: Metadata
) => {
  const existingItemInSet = existingSetItems.find(
    (item) => item.content_url === contentUrl
  );

  const itemUrl = existingItemInSet
    ? `/api/sets/${setUid}/items/${existingItemInSet.uid}/`
    : `/api/sets/${setUid}/items/`;
  await authenticatedSkylarkRequest(itemUrl, {
    method: existingItemInSet ? "PUT" : "POST",
    data: {
      content_url: contentUrl,
      position,
      schedule_urls: [metadata.schedules.always.self],
    },
  });
};

export const createOrUpdateSetAndContents = async (
  setConfig: SetConfig,
  metadata: Metadata
) => {
  const additionalAirtableProperties = metadata.set.metadata.find(
    ({ slug: metadataSlug }) => metadataSlug === setConfig.slug
  );

  const set = await createOrUpdateSet(
    setConfig,
    metadata,
    additionalAirtableProperties
  );

  if (additionalAirtableProperties) {
    await parseAirtableImagesAndUploadToSkylark(
      additionalAirtableProperties,
      set,
      metadata
    );
  }

  const existingSetItems = set ? await getSetItems(set.uid) : [];

  await Promise.all(
    setConfig.contents.map(async (config, index) => {
      const position = index + 1;
      let object: ApiEntertainmentObject | ApiDynamicObject | null;
      if (config.type === "set") {
        object = await getSetBySlug(config.set_type, config.slug);
      } else if (config.type === "dynamic-object") {
        object = await getResourceByName<ApiDynamicObject>(
          "computed-scheduled-items",
          config.name
        );
      } else {
        object = await getResourceBySlug<ApiEntertainmentObject>(
          config.type,
          config.slug
        );
      }

      if (!object) {
        throw new Error(
          `Object requested for set item ${
            config.type === "dynamic-object" ? config.name : config.slug
          } (${config.type}) not found`
        );
      }

      return createOrUpdateSetItem(
        set.uid,
        object.self,
        position,
        existingSetItems,
        metadata
      );
    })
  );
};
