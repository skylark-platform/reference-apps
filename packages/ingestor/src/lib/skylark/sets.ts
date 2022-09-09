import {
  ApiDynamicObject,
  ApiEntertainmentObject,
  ApiSetItem,
} from "@skylark-reference-apps/lib";
import { FieldSet } from "airtable";
import { SetConfig, Metadata } from "../../interfaces";
import { authenticatedSkylarkRequest } from "./api";
import {
  convertAirtableFieldsToSkylarkObject,
  parseAirtableImagesAndUploadToSkylark,
} from "./create";
import {
  getResourceByName,
  getResourceBySlug,
  getSetBySlug,
  getSetItems,
} from "./get";

/**
 * createOrUpdateSet - creates or updates a set in Skylark using its slug
 * @param setConfig
 * @param metadata
 * @param airtableProperties
 * @returns the set returned by Skylark
 */
const createOrUpdateSet = async (
  setConfig: SetConfig,
  metadata: Metadata,
  airtableProperties?: { id: string; fields: FieldSet }
) => {
  const { title, slug, set_type_slug: setTypeSlug } = setConfig;
  const setType = metadata.set.types.find(
    ({ slug: metadataSlug }) => metadataSlug === setTypeSlug
  );

  const existingSet = await getResourceBySlug<ApiEntertainmentObject>(
    "sets",
    slug
  );

  let object = {};
  let url = existingSet ? `/api/sets/${existingSet.uid}` : `/api/sets/`;
  let method = existingSet ? "PUT" : "POST";

  if (airtableProperties) {
    object = convertAirtableFieldsToSkylarkObject(
      airtableProperties.id,
      airtableProperties.fields,
      metadata
    );

    url = `/api/sets/versions/data-source/${airtableProperties.id}/`;
    method = "PUT";
  }

  const languages = ["en-gb", "pt-pt"];

  const [{ data: firstSet }] = await Promise.all(
    languages.map((language) =>
      authenticatedSkylarkRequest<ApiEntertainmentObject>(url, {
        method,
        data: {
          schedule_urls: [metadata.schedules.default.self],
          ...existingSet,
          ...object,
          uid: existingSet?.uid || "",
          self: existingSet?.self || "",
          title,
          slug,
          set_type_url: setType?.self,
        },
        headers: {
          "Accept-Language": language,
        },
      })
    )
  );

  return firstSet;
};

/**
 * createOrUpdateSetItem - creates or updates a set item in Skylark
 * @param setUid - uid of the set in Skylark
 * @param contentUrl - the URL of the set item
 * @param position - the position this item should be in the set
 * @param existingSetItems - all existing set items, used to check if this item is already in the set
 * @param metadata
 */
const createOrUpdateSetItem = async (
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
      schedule_urls: [metadata.schedules.default.self],
    },
  });
};

/**
 * createOrUpdateSetAndContents - Creates or updates a set and its contents
 * @param setConfig
 * @param metadata
 */
export const createOrUpdateSetAndContents = async (
  setConfig: SetConfig,
  metadata: Metadata
): Promise<void> => {
  const additionalAirtableProperties = metadata.set.additionalRecords.find(
    ({ fields: { slug: metadataSlug } }) => metadataSlug === setConfig.slug
  );

  const set = await createOrUpdateSet(
    setConfig,
    metadata,
    additionalAirtableProperties
  );

  if (
    additionalAirtableProperties &&
    additionalAirtableProperties.fields?.images
  ) {
    await parseAirtableImagesAndUploadToSkylark(
      additionalAirtableProperties.fields.images as string[],
      set,
      metadata
    );
  }

  if (setConfig.contents.length > 0) {
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
  }
};
