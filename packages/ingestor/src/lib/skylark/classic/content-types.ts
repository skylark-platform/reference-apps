import { ApiBaseObject } from "@skylark-reference-apps/lib";
import { Record, FieldSet } from "airtable";
import { authenticatedSkylarkRequest } from "./api";
import { convertAirtableFieldsToSkylarkObject } from "./create";
import {
  ApiAirtableFields,
  ApiContentObjectType,
  Metadata,
} from "../../../interfaces";

/**
 * getContentTypes - retrieves all content types of the given type from Skylark
 * @param type - type of Content Type
 * @returns - array of objects for the given content type
 */
const getContentTypes = async <T extends ApiBaseObject>(
  type: ApiContentObjectType
) => {
  const { data } = await authenticatedSkylarkRequest<{ objects?: T[] }>(
    `/api/${type}/`,
    { method: "GET" }
  );
  return data.objects;
};

/**
 * createOrUpdateContentTypes - creates or updates content types within Skylark
 * Fetches all content types and manually finds existing ones rather than using the Skylark API as the content types cannot be filtered by properties
 * @param type - type of Content Type
 * @param records - Airtable records
 * @param metadata
 * @returns
 */
export const createOrUpdateContentTypes = async <T extends ApiBaseObject>(
  type: ApiContentObjectType,
  records: Record<FieldSet>[],
  metadata: Metadata
) => {
  const existingTypes = await getContentTypes<T>(type);
  const contentTypes = await Promise.all(
    records.map(async (record): Promise<T & ApiAirtableFields> => {
      const existingContentObject = existingTypes?.find(
        (existingType) => existingType.slug === record.fields.slug
      );

      const contentTypeObject = convertAirtableFieldsToSkylarkObject(
        record.id,
        record.fields,
        metadata
      );

      const url = existingContentObject
        ? `/api/${type}/${existingContentObject.uid}`
        : `/api/${type}/`;
      const { data: contentType } = await authenticatedSkylarkRequest<T>(url, {
        method: existingContentObject ? "PUT" : "POST",
        data: {
          ...existingContentObject,
          ...contentTypeObject,
          uid: existingContentObject?.uid || "",
          self: existingContentObject?.self || "",
        },
      });

      return { ...contentType, airtableId: record.id };
    })
  );
  return contentTypes as (T & ApiAirtableFields)[];
};
