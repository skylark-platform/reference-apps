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
  airtableMetadataTranslations?: { id: string; fields: FieldSet }[]
) => {
  const { dataSourceId, title, slug, set_type_slug: setTypeSlug } = setConfig;
  const setType = metadata.set.types.find(
    ({ slug: metadataSlug }) => metadataSlug === setTypeSlug
  );

  const existingSet = await getResourceBySlug<ApiEntertainmentObject>(
    "sets",
    slug
  );

  const url = `/api/sets/versions/data-source/${dataSourceId}/`;
  const method = "PUT";

  if (airtableMetadataTranslations && airtableMetadataTranslations.length > 0) {
    const sets = [];

    // Creating sets with the same data_source_id in parallel does not work as we need to create the set first before adding additional translations
    // due to this, we create sets in a synchronous order
    // eslint-disable-next-line no-restricted-syntax
    for (const metadataTranslation of airtableMetadataTranslations) {
      const { fields }: { fields: { language?: string } } = metadataTranslation;
      const object = convertAirtableFieldsToSkylarkObject(
        dataSourceId,
        fields,
        metadata
      );

      const languageCodes: { [key: string]: string } = {};
      metadata.dimensions.languages.forEach(({ airtableId, iso_code }) => {
        languageCodes[airtableId] = iso_code || "";
      });

      // eslint-disable-next-line no-await-in-loop
      const set = await authenticatedSkylarkRequest<ApiEntertainmentObject>(
        url,
        {
          method,
          data: {
            schedule_urls: [metadata.schedules.default.self],
            ...existingSet,
            ...object,
            data_source_id: dataSourceId,
            uid: existingSet?.uid || "",
            self: existingSet?.self || "",
            title,
            slug,
            set_type_url: setType?.self,
          },
          headers: {
            "Accept-Language": fields.language
              ? languageCodes[fields.language]
              : "",
          },
        }
      );
      sets.push(set);
    }

    return sets[0].data;
  }

  const { data: set } =
    await authenticatedSkylarkRequest<ApiEntertainmentObject>(url, {
      method,
      data: {
        schedule_urls: [metadata.schedules.default.self],
        ...existingSet,
        title,
        slug,
        set_type_url: setType?.self,
      },
    });

  return set;
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
  const airtableTranslations = metadata.set.additionalRecords.filter(
    ({ fields: { slug: metadataSlug } }) => metadataSlug === setConfig.slug
  );

  const set = await createOrUpdateSet(
    setConfig,
    metadata,
    airtableTranslations
  );

  if (
    airtableTranslations &&
    airtableTranslations.length > 0 &&
    airtableTranslations[0].fields?.images
  ) {
    await parseAirtableImagesAndUploadToSkylark(
      airtableTranslations[0].fields.images as string[],
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
