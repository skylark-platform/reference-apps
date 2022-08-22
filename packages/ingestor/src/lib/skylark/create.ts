import {
  ApiBaseObject,
  ApiImage,
  ApiRole,
  ApiDynamicObject,
  ApiCreditUnexpanded,
  ApiPerson,
} from "@skylark-reference-apps/lib";
import { Attachment, FieldSet, Records, Record } from "airtable";
import { compact, flatten } from "lodash";
import {
  ApiEntertainmentObjectWithAirtableId,
  ApiSkylarkObjectWithAllPotentialFields,
  DynamicObjectConfig,
  Metadata,
} from "../../interfaces";
import { authenticatedSkylarkRequest, batchSkylarkRequest } from "./api";
import { getResourceByDataSourceId, getResourceByProperty } from "./get";
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
    property: "slug" | "title" | "name" | "data_source_id";
    value: string;
  },
  data: object
) => {
  const existingObject =
    lookup.property === "data_source_id"
      ? await getResourceByDataSourceId<T>(type, lookup.value)
      : await getResourceByProperty<T>(type, lookup.property, lookup.value);

  // Patch method is safer when updating objects, but the /api/images endpoint doesn't implement it
  const updateMethod = type === "images" ? "PUT" : "PATCH";

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
 * bulkCreateOrUpdateObjectsWithLookup - creates or updates an array of objects in Skylark using an object field
 * @param objects - the objects to create or update in Skylark
 * @param objectTypes - The types of the objects to create (episodes, seasons)
 * @param lookupMethod - method to find the object within Skylark
 * @returns
 */
export const bulkCreateOrUpdateObjectsWithLookup = async <
  T extends ApiBaseObject
>(
  objects: ApiSkylarkObjectWithAllPotentialFields[],
  objectTypes: { [id: string]: string },
  lookupMethod: "slug" | "title"
) => {
  const getBatchRequestData = objects.map((object) => {
    const type = objectTypes[object.data_source_id];

    const lookupValue = object[lookupMethod] as string;
    const url = `/api/${type}/?${lookupMethod}=${lookupValue}`;

    return {
      id: object.data_source_id,
      method: "GET",
      url,
    };
  });
  const getBatchResponseData = await batchSkylarkRequest<{ objects?: T[] }>(
    getBatchRequestData,
    { ignore404s: true }
  );

  const createOrUpdateBatchRequestData = objects.map(({ ...object }) => {
    const matchingBatchResponse = getBatchResponseData.find(
      ({ batchRequestId }) => batchRequestId === object.data_source_id
    );

    const existingObject = matchingBatchResponse?.data.objects?.[0];
    const type = objectTypes[object.data_source_id];
    const url = existingObject ? existingObject.self : `/api/${type}/`;
    const method = existingObject ? "PATCH" : "POST";
    return {
      id: object.data_source_id,
      method,
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

  return createOrUpdateBatchResponseData.map(({ data, batchRequestId }) => {
    if (!data.data_source_id) {
      // Add data_source_id when one isn't returned (bugfix for roles)
      return {
        ...data,
        data_source_id: batchRequestId,
      };
    }

    return data;
  });
};

/**
 * bulkCreateOrUpdateObjectsUsingDataSourceId - creates or updates an array of objects in Skylark using the data_source_id
 * @param objects - the objects to create or update in Skylark
 * @param objectTypes - The types of the objects to create (episodes, seasons)
 * @returns
 */
export const bulkCreateOrUpdateObjectsUsingDataSourceId = async <
  T extends ApiBaseObject
>(
  objects: ApiSkylarkObjectWithAllPotentialFields[],
  objectTypes: { [id: string]: string }
) => {
  const getBatchRequestData = objects.map((object) => {
    const type = objectTypes[object.data_source_id];

    const url = `/api/${type}/versions/data-source/${object.data_source_id}/`;

    return {
      id: object.data_source_id,
      method: "GET",
      url,
    };
  });

  const getBatchResponseData = await batchSkylarkRequest<T>(
    getBatchRequestData,
    { ignore404s: true }
  );

  const createOrUpdateBatchRequestData = objects.map(({ ...object }) => {
    const matchingBatchResponse = getBatchResponseData.find(
      ({ batchRequestId }) => batchRequestId === object.data_source_id
    );

    const existingObject =
      matchingBatchResponse?.code !== 404 ? matchingBatchResponse?.data : null;
    const type = objectTypes[object.data_source_id];
    const url = `/api/${type}/versions/data-source/${object.data_source_id}/`;
    const method = "PUT";
    return {
      id: `${method}-${url}`,
      method,
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

  return createOrUpdateBatchResponseData.map(({ data }) => data);
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
    data
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
        type: string[];
        image: Attachment[];
        schedules: string[];
      };

      if (!type || type.length === 0) {
        throw new Error(`No image types given for image "${title}"`);
      }
      const imageType = metadata.imageTypes.find(
        ({ airtableId: imageTypeAirtableId }) => imageTypeAirtableId === type[0]
      );
      if (!imageType) {
        throw new Error(`Invalid image type "${type[0]}" for image "${title}"`);
      }

      const scheduleUrls = getScheduleUrlsFromMetadata(
        schedules,
        metadata.schedules
      );

      const dataSourceId = `${airtableImage.id}-${objectToAttachTo.uid}`;

      const imageData = {
        image_type_url: imageType.self,
        title,
        schedule_urls: scheduleUrls,
        image_location: image.url,
        content_url: objectToAttachTo.self,
        data_source_id: dataSourceId,
      };

      return createOrUpdateObject<ApiImage>(
        "images",
        { property: "data_source_id", value: dataSourceId },
        imageData
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
    data_source_id: airtableId,
  };

  // Credits cannot be updated when using data source URLs. See SL-2204
  // const credits = getCreditsFromField(fields.credits as string[], metadata);
  // if (credits) {
  //   object.credits = credits;
  // }

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

  const [assetType] =
    getUrlsFromField(fields.asset_type as string[], metadata.assetTypes) || [];
  if (assetType) {
    object.asset_type_url = assetType;
  }

  const sanitizedObject =
    removeUndefinedPropertiesFromObject<ApiSkylarkObjectWithAllPotentialFields>(
      object
    );

  return sanitizedObject;
};

/**
 * updateCredits - updates Credits using an object's self property
 * Workaround for SL-2204 using the normal object endpoints
 */
export const updateCredits = async <T extends ApiBaseObject>(
  objects: T[],
  records: Records<FieldSet>,
  metadata: Metadata
) => {
  const updateCreditsBatchRequestData = objects.map((object) => {
    const record = records.find(
      ({ id }) => id === object.data_source_id
    ) as Record<FieldSet>;
    if (!record) {
      return null;
    }

    const url = object.self;
    const method = "PATCH"; // PATCH to not update other fields
    const credits =
      getCreditsFromField(record.fields.credits as string[], metadata) || [];

    return {
      id: `CREDITS-${object.uid}`,
      method,
      url,
      data: JSON.stringify({
        credits: credits || [],
      }),
    };
  });

  await batchSkylarkRequest<T>(compact(updateCreditsBatchRequestData));
};

/**
 * createOrUpdateAirtableObjectsInSkylark - creates or updates objects in Skylark using Records from Airtable
 * @param airtableRecords - Airtable records from a table of the given type
 * @param metadata
 * @param parents - Potential parents for the objects
 * @returns
 */
export const createOrUpdateAirtableObjectsInSkylark = async <
  T extends ApiBaseObject
>(
  airtableRecords: Records<FieldSet>,
  metadata: Metadata,
  parents?: ApiEntertainmentObjectWithAirtableId[]
) => {
  const objectData = airtableRecords.map(({ fields, id }) => {
    const object = convertAirtableFieldsToSkylarkObject(
      id,
      fields,
      metadata,
      parents
    );
    return object;
  });

  const objectTypes: { [id: string]: string } = {};
  airtableRecords.forEach(({ id, fields, _table }) => {
    objectTypes[id] = (fields.skylark_object_type as string) || _table.name;
  });

  const createOrUpdateBatchResponseData =
    await bulkCreateOrUpdateObjectsUsingDataSourceId<T>(
      objectData,
      objectTypes
    );

  await updateCredits<T>(
    createOrUpdateBatchResponseData,
    airtableRecords,
    metadata
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
          airtableId: data.data_source_id as string,
          image_urls: imageUrls,
        };
      }
    )
  );

  return parseObjectsAndCreateImages;
};

/**
 * createOrUpdateAirtableObjectsInSkylarkWithParentsInSameTable - creates or updates objects in Skylark using Records from Airtable
 * Sets parent_urls when the logic for parents are within the same Airtable
 * @param airtableRecords - Airtable records from a table of the given type
 * @param metadata
 * @returns
 */
export const createOrUpdateAirtableObjectsInSkylarkWithParentsInSameTable =
  async (
    airtableRecords: Records<FieldSet>,
    metadata: Metadata
  ): Promise<ApiEntertainmentObjectWithAirtableId[]> => {
    const createdMediaObjects: ApiEntertainmentObjectWithAirtableId[] = [];
    while (createdMediaObjects.length < airtableRecords.length) {
      const objectsToCreateUpdate = airtableRecords.filter((record) => {
        // Filter out any records that have already been created
        const alreadyCreated = createdMediaObjects.find(
          (createdRecord) => record.id === createdRecord.airtableId
        );
        if (alreadyCreated) {
          return false;
        }

        // If the record doesn't have a parent, we can create it without dependencies on other objects
        if (!record.fields.parent) {
          return true;
        }

        // If the record has a parent, we need to ensure that its parent object has been created first
        const found = createdMediaObjects.find((createdRecord) =>
          (record.fields.parent as string[]).includes(createdRecord.airtableId)
        );
        return found;
      });

      // Stops infinite loop
      if (objectsToCreateUpdate.length === 0) {
        break;
      }

      const objs =
        // eslint-disable-next-line no-await-in-loop
        await createOrUpdateAirtableObjectsInSkylark<ApiEntertainmentObjectWithAirtableId>(
          objectsToCreateUpdate,
          metadata,
          createdMediaObjects
        );

      createdMediaObjects.push(...objs);
    }

    return createdMediaObjects;
  };

/**
 * createTranslationsForObjects - creates translations for Skylark objects
 * @param originalObjects - The objects created in Skylark in the default language
 * @param translationsTable - Airtable with a link to an originalObject with translated metadata
 * @param metadata
 * @returns
 */
export const createTranslationsForObjects = async (
  originalObjects: ApiEntertainmentObjectWithAirtableId[],
  translationsTable: Records<FieldSet>,
  metadata: Metadata
) => {
  const languageCodes: { [key: string]: string } = {};
  metadata.dimensions.languages.forEach(({ airtableId, iso_code }) => {
    languageCodes[airtableId] = iso_code || "";
  });

  const translationObjectData = translationsTable.map(({ fields, id }) => {
    if (!fields.object || !Array.isArray(fields.object)) {
      return [];
    }

    const [objectAirtableId] = fields.object as string[];
    const originalObject = originalObjects.find(
      ({ airtableId }) => airtableId === objectAirtableId
    );

    // if the original object doesn't exist
    if (!originalObject) {
      return [];
    }

    const object = convertAirtableFieldsToSkylarkObject(id, fields, metadata);

    object.uid = originalObject.uid;
    object.self = originalObject.self;

    // Don't change any data source fields
    object.data_source_id = originalObject.airtableId;
    delete object.data_source_fields;
    delete object.is_data_source;

    // Schedules are global so don't update
    delete object.schedule_urls;

    const languages = fields.languages as string[];
    return languages.map((languageAirtableId) => ({
      method: "PATCH",
      url: object.self,
      headers: {
        "Accept-Language": languageCodes[languageAirtableId],
      },
      data: object,
    }));
  });

  const batchRequestData = flatten(translationObjectData);

  await Promise.all(
    batchRequestData.map(({ method, url, headers, data }) =>
      authenticatedSkylarkRequest(url, {
        headers,
        data,
        method,
      })
    )
  );
};
