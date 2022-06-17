import {
  ApiBaseObject,
  ApiDynamicObject,
  ApiEntertainmentObject,
} from "@skylark-reference-apps/lib";
import { Attachment, FieldSet } from "airtable";
import {
  createImage,
  createOrUpdateSet,
  createOrUpdateSetItem,
  getDynamicObjectByName,
  getResourceBySlug,
  getSetBySlug,
  getSetItems,
} from "./api/skylark";
import { Metadata, SetConfig } from "./interfaces";

export const parseAirtableImagesAndUploadToSkylark = <T extends ApiBaseObject>(
  fields: FieldSet,
  objectToAttachTo: T,
  metadata: Metadata
) =>
  Promise.all(
    Object.keys(fields)
      .filter((key) => key.startsWith("image__"))
      .map((key) => {
        const [airtableImage] = fields[key] as Attachment[];
        const imageSlug = key.replace("image__", "");
        const imageType = metadata.imageTypes.find(
          ({ slug }) => slug === imageSlug
        );
        if (!imageType) {
          throw new Error(`Invalid image type ${imageSlug} (${key})`);
        }
        return createImage(
          airtableImage.filename,
          airtableImage.url,
          objectToAttachTo.self,
          imageType.self,
          [metadata.schedules.always.self]
        );
      })
  );

export const createOrUpdateSetAndContents = async (
  setConfig: SetConfig,
  metadata: Metadata
) => {
  const additionalAirtableProperties = metadata.set.metadata.find(
    ({ slug: metadataSlug }) => metadataSlug === setConfig.slug
  );
  console.log(setConfig, additionalAirtableProperties);

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
        object = await getDynamicObjectByName(config.name);
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
