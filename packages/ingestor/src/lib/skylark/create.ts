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
import { authenticatedSkylarkRequest } from "./api";
import { getResourceByProperty } from "./get";

const createOrUpdateObject = async <T extends ApiBaseObject>(
  type: ApiObjectType,
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

export const createOrUpdateDynamicObject = (
  { name, resource, query }: DynamicObjectConfig,
  metadata: Metadata
) => {
  const data: Partial<ApiDynamicObject> = {
    uid: "",
    self: "",
    name,
    url: `/api/${resource}/?order=-created&q=${query}`,
    schedule_urls: [metadata.schedules.always.self],
  };
  return createOrUpdateObject<ApiDynamicObject>(
    "computed-scheduled-items",
    { property: "name", value: name },
    data,
    "PUT"
  );
};

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
          throw new Error(
            `Invalid image type "${imageSlug}" (${key} field on Airtable)`
          );
        }

        const imageData = {
          image_type_url: imageType.self,
          title: airtableImage.filename,
          schedule_urls: [metadata.schedules.always.self],
          image_location: airtableImage.url,
          content_url: objectToAttachTo.self,
        };

        return createOrUpdateObject<ApiImage>(
          "images",
          { property: "title", value: airtableImage.filename },
          imageData,
          "PUT"
        );
      })
  );

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

export const convertAirtableFieldsToSkylarkObject = (
  fields: FieldSet,
  metadata: Metadata,
  parents?: ApiEntertainmentObjectWithAirtableId[]
) => {
  const parentObject = parents?.find(
    ({ airtableId }) =>
      fields.parent && (fields.parent as string[])[0] === airtableId
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
    schedule_urls: [metadata.schedules.always.self],
    season_number: fields?.season_number as number,
    number_of_episodes: fields?.number_of_episodes as number,
    episode_number: fields?.episode_number as number,
    value: fields?.value as string,
  };

  // Only add Credits if there are any so we don't clear any
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

  return object;
};

const createOrUpdateAirtableObjectsInSkylark = <T extends ApiBaseObject>(
  type: ApiObjectType,
  airtableRecords: Records<FieldSet>,
  metadata: Metadata,
  parents: ApiEntertainmentObjectWithAirtableId[],
  lookupProperty: "slug" | "title"
) => {
  const promises = airtableRecords.map(
    async ({ fields, id }): Promise<T & { airtableId: string }> => {
      const object = convertAirtableFieldsToSkylarkObject(
        fields,
        metadata,
        parents
      );

      const createdObject = await createOrUpdateObject<T>(
        type,
        { property: lookupProperty, value: object[lookupProperty] },
        object,
        "PATCH"
      );

      const imageUrls = await parseAirtableImagesAndUploadToSkylark<T>(
        fields,
        createdObject,
        metadata
      );

      return {
        ...createdObject,
        airtableId: id,
        image_urls: imageUrls,
      };
    }
  );

  return Promise.all(promises);
};

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
