import {
  ApiBaseObject,
  ApiImage,
  ApiRole,
  ApiDynamicObject,
  ApiCreditUnexpanded,
  ApiPerson,
} from "@skylark-reference-apps/lib";
import { Attachment, FieldSet, Records, Record } from "airtable";
import {
  ApiEntertainmentObjectWithAirtableId,
  ApiObjectType,
  ApiSkylarkObjectWithAllPotentialFields,
  DynamicObjectConfig,
  Metadata,
} from "../../interfaces";
import { authenticatedSkylarkRequest, batchSkylarkRequest } from "./api";
import { getResourceByProperty } from "./get";
import {
  getScheduleUrlsFromMetadata,
  removeUndefinedPropertiesFromObject,
} from "./utils";

/**
 * createOrUpdateObject - creates or updates an object in Skylark
 * @param type - the Skylark object endpoint
 * @param lookup - an object containing a property and value to use to find the object in Skylark
 * @param data - additional data to add to the object
 * @param updateMethod - HTTP method to use to update the object in Skylark
 * @returns data returned by the Skylark API
 */
export const createOrUpdateObject = async <T extends ApiBaseObject>(
  type: string,
  lookup: {
    property: "slug" | "title" | "name";
    value: string;
  },
  data: object,
  updateMethod: "PUT" | "PATCH"
) => {
  const existingObject = await getResourceByProperty<T>(
    type,
    lookup.property,
    lookup.value
  );
  const url = `/api/${type}/${existingObject?.uid || ""}`;
  const res = await authenticatedSkylarkRequest(url, {
    method: existingObject ? updateMethod : "POST",
    data: {
      ...existingObject,
      ...data,
    },
  });
  return res.data as T;
};

/**
 * bulkCreateOrUpdateObjects - creates or updates an array of objects in Skylark using the bulk
 * @param type - the Skylark object endpoint
 * @param lookupProperty - the property to use to find the object in Skylark
 * @param objects - the objects to create or update in Skylark
 * @param updateMethod - HTTP method to use to update the object in Skylark
 * @returns
 */
export const bulkCreateOrUpdateObjects = async <T extends ApiBaseObject>(
  type: string,
  lookupProperty: "slug" | "title" | "name",
  objects: ApiSkylarkObjectWithAllPotentialFields[],
  updateMethod: "PUT" | "PATCH"
) => {
  const getBatchRequestData = objects.map((object) => {
    const lookupValue = object[lookupProperty] as string;
    return {
      id: object.data_source_id,
      method: "GET",
      url: `/api/${type}/?${lookupProperty}=${lookupValue}`,
    };
  });
  const getBatchResponseData = await batchSkylarkRequest<{ objects?: T[] }>(
    getBatchRequestData
  );

  const createOrUpdateBatchRequestData = objects.map((object) => {
    const matchingBatchResponse = getBatchResponseData.find(
      ({ batchRequestId }) => batchRequestId === object.data_source_id
    );

    const existingObject = matchingBatchResponse?.data.objects?.[0];
    const url = existingObject ? existingObject.self : `/api/${type}/`;
    return {
      id: object.data_source_id,
      method: existingObject ? updateMethod : "POST",
      url,
      data: JSON.stringify({
        ...existingObject,
        ...object,
        uid: existingObject?.uid || "",
        self: existingObject?.self || "",
      }),
    };
  });
  const createOrUpdateBatchResponseData = await batchSkylarkRequest<T>(
    createOrUpdateBatchRequestData
  );

  return createOrUpdateBatchResponseData.map(({ data, batchRequestId }) => ({
    ...data,
    data_source_id: batchRequestId,
  }));
};

/**
 * createOrUpdateDynamicObject - creates or updates a dynamic object in Skylark
 * @param dynamicObjectConfig
 * @param metadata
 * @returns data returned from Skylark
 */
export const createOrUpdateDynamicObject = (
  { name, resource, query }: DynamicObjectConfig,
  metadata: Metadata
) => {
  const data: Partial<ApiDynamicObject> = {
    uid: "",
    self: "",
    name,
    url: `/api/${resource}/?order=-created&q=${query}`,
    schedule_urls: [metadata.schedules.default.self],
  };
  return createOrUpdateObject<ApiDynamicObject>(
    "computed-scheduled-items",
    { property: "name", value: name },
    data,
    "PUT"
  );
};

/**
 * parseAirtableImagesAndUploadToSkylark - Uploads an image and connects a Skylark object
 * @param imagesAsAirtableIds - The images to connect to the object represented by their Airtable ID
 * @param objectToAttachTo - The Skylark object to attach the image to
 * @param metadata
 * @returns
 */
export const parseAirtableImagesAndUploadToSkylark = <T extends ApiBaseObject>(
  imagesAsAirtableIds: string[],
  objectToAttachTo: T,
  metadata: Metadata
) =>
  Promise.all(
    imagesAsAirtableIds.map((airtableId) => {
      const airtableImage = metadata.airtableImages.find(
        (record) => record.id === airtableId
      );
      if (!airtableImage) {
        throw new Error(`Image not found for ID: ${airtableId}`);
      }
      const {
        title,
        type,
        image: [image],
        schedules,
      } = airtableImage.fields as {
        title: string;
        type: string;
        image: Attachment[];
        schedules: string[];
      };
      const imageType = metadata.imageTypes.find(
        ({ airtableId: imageTypeAirtableId }) => imageTypeAirtableId === type
      );
      if (!imageType) {
        throw new Error(`Invalid image type "${type}"`);
      }

      const scheduleUrls = getScheduleUrlsFromMetadata(
        schedules,
        metadata.schedules
      );

      const imageData = {
        image_type_url: imageType.self,
        title,
        schedule_urls: scheduleUrls,
        image_location: image.url,
        content_url: objectToAttachTo.self,
      };

      return createOrUpdateObject<ApiImage>(
        "images",
        { property: "title", value: title },
        imageData,
        "PUT"
      );
    })
  );

/**
 * getPeopleAndRoleUrlsFromCredit - returns a Skylark API Credit object
 * uses the Credits, People and Roles Airtables to map a Credit to its Skylark people and role URLs
 * @param { credit } - The credit to find the people and role URLs for
 * @param people - People returned by the Skylark API with their Airtable IDs
 * @param roles - Roles returned by the Skylark API with their Airtable IDs
 * @returns
 */
const getPeopleAndRoleUrlsFromCredit = (
  { fields: credit }: Record<FieldSet>,
  people: (ApiPerson & { airtableId: string })[],
  roles: (ApiRole & { airtableId: string })[]
): ApiCreditUnexpanded | null => {
  const person = people.find(
    (p) => p.airtableId === (credit.person as string[])[0]
  );
  const role = roles.find((r) => r.airtableId === (credit.role as string[])[0]);
  if (person && role) {
    return {
      people_url: person?.self,
      role_url: role?.self,
    };
  }
  return null;
};

/**
 * getCreditsFromField - given a credit field, returns the Skylark Credit object containing a people_url and role_url
 * @param fieldCredits - array of Airtable IDs that match entries in the Credits table
 * @param metadata
 * @returns
 */
const getCreditsFromField = (
  fieldCredits: string[] | null,
  metadata: Metadata
) => {
  if (!fieldCredits || fieldCredits.length === 0) {
    return null;
  }
  const credits = fieldCredits.map((creditId) =>
    metadata.airtableCredits.find(
      ({ id: airtableCreditId }) => airtableCreditId === creditId
    )
  );
  const apiCredits = credits
    .map(
      (credit) =>
        credit &&
        getPeopleAndRoleUrlsFromCredit(credit, metadata.people, metadata.roles)
    )
    .filter((credit) => !!credit) as ApiCreditUnexpanded[];
  return apiCredits;
};

/**
 * getUrlsFromField - gets Skylark object URLs from a given field array
 * @param field - String array containing Airtable IDs that are found in the SkylarkData variable
 * @param skylarkData - object containing Airtable IDs and a Skylark object's self field
 * @returns array of Skylark object URLs
 */
const getUrlsFromField = (
  field: string[] | null,
  skylarkData: { airtableId: string; self: string }[]
) => {
  if (!field || field.length === 0) {
    return null;
  }

  const urls = skylarkData
    .filter(({ airtableId }) => field.includes(airtableId))
    .map(({ self }) => self);
  return urls;
};

/**
 * convertAirtableFieldsToSkylarkObject - Converts an Airtable entry into a Skylark object
 * @param airtableId - Airtable ID of the object
 * @param fields - Fields in Airtable
 * @param metadata
 * @param parents - All possible parents of the Skylark object
 * @returns a Skylark object
 */
export const convertAirtableFieldsToSkylarkObject = (
  airtableId: string,
  fields: FieldSet,
  metadata: Metadata,
  parents?: ApiEntertainmentObjectWithAirtableId[]
) => {
  const parentObject = parents?.find(
    ({ airtableId: parentAirtableId }) =>
      fields.parent && (fields.parent as string[])[0] === parentAirtableId
  );

  const scheduleUrls = getScheduleUrlsFromMetadata(
    fields.schedules as string[],
    metadata.schedules
  );

  const object: ApiSkylarkObjectWithAllPotentialFields = {
    uid: "",
    self: "",
    name: fields?.name as string,
    title: fields?.title as string,
    slug: fields?.slug as string,
    title_short: fields?.title_short as string,
    title_medium: fields?.title_medium as string,
    title_long: fields?.title_long as string,
    synopsis_short: fields?.synopsis_short as string,
    synopsis_medium: fields?.synopsis_medium as string,
    synopsis_long: fields?.synopsis_long as string,
    release_date: fields?.release_date as string,
    parent_url: parentObject?.self,
    schedule_urls: scheduleUrls,
    season_number: fields?.season_number as number,
    number_of_episodes: fields?.number_of_episodes as number,
    episode_number: fields?.episode_number as number,
    value: fields?.value as string,
    is_data_source: true,
    data_source_id: airtableId,
    data_source_fields: ["name", "title", "slug"],
  };

  const credits = getCreditsFromField(fields.credits as string[], metadata);
  if (credits) {
    object.credits = credits;
  }

  const genreUrls = getUrlsFromField(
    fields.genres as string[],
    metadata.genres
  );
  if (genreUrls) {
    object.genre_urls = genreUrls;
  }

  const themeUrls = getUrlsFromField(
    fields.themes as string[],
    metadata.themes
  );
  if (themeUrls) {
    object.theme_urls = themeUrls;
  }

  const ratingUrls = getUrlsFromField(
    fields.ratings as string[],
    metadata.ratings
  );
  if (ratingUrls) {
    object.rating_urls = ratingUrls;
  }

  return removeUndefinedPropertiesFromObject<ApiSkylarkObjectWithAllPotentialFields>(
    object
  );
};

/**
 * createOrUpdateAirtableObjectsInSkylark - creates or updates objects in Skylark using Records from Airtable
 * @param type - The Skylark object
 * @param airtableRecords - Airtable records from a table of the given type
 * @param metadata
 * @param parents - Potential parents for the objects
 * @param lookupProperty - property to use to check whether the object exists in Skylark
 * @returns
 */
const createOrUpdateAirtableObjectsInSkylark = async <T extends ApiBaseObject>(
  type: ApiObjectType,
  airtableRecords: Records<FieldSet>,
  metadata: Metadata,
  parents: ApiEntertainmentObjectWithAirtableId[],
  lookupProperty: "slug" | "title"
) => {
  const objects = airtableRecords.map(({ fields, id }) => {
    const object = convertAirtableFieldsToSkylarkObject(
      id,
      fields,
      metadata,
      parents
    );
    return object;
  });

  const createOrUpdateBatchResponseData = await bulkCreateOrUpdateObjects<T>(
    type,
    lookupProperty,
    objects,
    "PATCH"
  );

  const parseObjectsAndCreateImages = await Promise.all(
    createOrUpdateBatchResponseData.map(
      async (data): Promise<T & { airtableId: string }> => {
        const airtableFields = airtableRecords.find(
          ({ id }) => id === data.data_source_id
        );
        const imageUrls = airtableFields?.fields?.images
          ? await parseAirtableImagesAndUploadToSkylark<T>(
              airtableFields.fields.images as string[],
              data,
              metadata
            )
          : [];

        return {
          ...data,
          airtableId: data.data_source_id,
          image_urls: imageUrls,
        };
      }
    )
  );

  return parseObjectsAndCreateImages;
};

/**
 * createOrUpdateAirtableObjectsInSkylarkBySlug - wrapper for createOrUpdateAirtableObjectsInSkylark that uses the slug to lookup existing objects
 * @param type - The Skylark object
 * @param airtableRecords - Airtable records from a table of the given type
 * @param metadata
 * @param parents - Potential parents for the objects
 * @returns
 */
export const createOrUpdateAirtableObjectsInSkylarkBySlug = <
  T extends ApiBaseObject
>(
  type: ApiObjectType,
  airtableRecords: Records<FieldSet>,
  metadata: Metadata,
  parents?: ApiEntertainmentObjectWithAirtableId[]
) =>
  createOrUpdateAirtableObjectsInSkylark<T>(
    type,
    airtableRecords,
    metadata,
    parents || [],
    "slug"
  );

/**
 * createOrUpdateAirtableObjectsInSkylarkByTitle - wrapper for createOrUpdateAirtableObjectsInSkylark that uses the title to lookup existing objects
 * @param type - The Skylark object
 * @param airtableRecords - Airtable records from a table of the given type
 * @param metadata
 * @param parents - Potential parents for the objects
 * @returns
 */
export const createOrUpdateAirtableObjectsInSkylarkByTitle = <
  T extends ApiBaseObject
>(
  type: ApiObjectType,
  airtableRecords: Records<FieldSet>,
  metadata: Metadata,
  parents?: ApiEntertainmentObjectWithAirtableId[]
) =>
  createOrUpdateAirtableObjectsInSkylark<T>(
    type,
    airtableRecords,
    metadata,
    parents || [],
    "title"
  );
