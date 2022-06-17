import {
  ApiBaseObject,
  ApiDynamicObject,
  ApiEntertainmentObject,
  ApiImage,
  ApiImageType,
  ApiPerson,
  ApiRole,
  ApiSchedule,
  ApiSetItem,
  ApiSetType,
  SetTypes,
  SKYLARK_API,
} from "@skylark-reference-apps/lib";
import { FieldSet } from "airtable";
import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "../cognito";
import {
  ApiObjectType,
  DynamicObjectConfig,
  Metadata,
  SetConfig,
} from "../interfaces";

const authenticatedSkylarkRequest = async <T>(
  path: string,
  config?: AxiosRequestConfig
) => {
  const token = await getToken();
  const url = new URL(path, SKYLARK_API).toString();

  return axios.request<T>({
    ...config,
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getResourceByProperty = async <T>(
  resource: string,
  property: string,
  value: string
) => {
  const res = await authenticatedSkylarkRequest<{ objects: T[] }>(
    `/api/${resource}/?${property}=${value}`,
    {
      method: "GET",
      params: {
        all: true,
      },
    }
  );

  if (!res.data.objects || res.data.objects.length === 0) {
    return null;
  }
  return res.data.objects[0];
};

export const getResourceBySlug = <T>(resource: string, slug: string) =>
  getResourceByProperty<T>(resource, "slug", slug);

export const getResourceByTitle = <T>(resource: string, title: string) =>
  getResourceByProperty<T>(resource, "title", title);

export const getDynamicObjectByName = async (
  name: string
): Promise<ApiDynamicObject | null> => {
  const res = await authenticatedSkylarkRequest<{
    objects: ApiDynamicObject[];
  }>(`/api/computed-scheduled-items/?name=${name}`, {
    method: "GET",
    params: {
      all: true,
    },
  });

  if (!res.data.objects || res.data.objects.length === 0) {
    return null;
  }
  return res.data.objects[0];
};

export const getSetBySlug = async (
  setType: SetTypes,
  slug: string
): Promise<ApiEntertainmentObject | null> => {
  const res = await authenticatedSkylarkRequest<{
    objects: ApiEntertainmentObject[];
  }>(`/api/sets/?set_type_slug=${setType}&slug=${slug}`, {
    method: "GET",
    params: {
      all: true,
    },
  });

  if (!res.data.objects || res.data.objects.length === 0) {
    return null;
  }
  return res.data.objects[0];
};

export const getAlwaysSchedule = async (): Promise<ApiSchedule> => {
  const res = await authenticatedSkylarkRequest<{ objects: ApiSchedule[] }>(
    "/api/schedules/",
    {
      params: {
        slug: "always-licence",
      },
    }
  );

  if (!res.data.objects || res.data.objects.length === 0) {
    throw new Error("Always schedule not found");
  }
  return res.data.objects[0];
};

export const getImageTypes = async (): Promise<ApiImageType[]> => {
  const res = await authenticatedSkylarkRequest<{ objects: ApiImageType[] }>(
    "/api/image-types/"
  );
  return res.data.objects;
};

export const getSetTypes = async (): Promise<ApiSetType[]> => {
  const res = await authenticatedSkylarkRequest<{ objects: ApiSetType[] }>(
    "/api/set-types/"
  );
  return res.data.objects;
};

export const createOrUpdateObject = async <T extends ApiBaseObject>(
  type: ApiObjectType,
  object: ApiEntertainmentObject | ApiPerson
) => {
  const existingObject = await getResourceBySlug<T>(type, object.slug);

  const url = existingObject
    ? `/api/${type}/${existingObject.uid}`
    : `/api/${type}/`;
  const res = await authenticatedSkylarkRequest(url, {
    method: existingObject ? "PATCH" : "POST",
    data: {
      ...existingObject,
      ...object,
      uid: existingObject?.uid || "",
      self: existingObject?.self || "",
    },
  });
  return res.data as T;

  // return createEntertainmentObject(type, object);
};

export const createImage = async (
  title: string,
  imageLocation: string,
  contentUrl: string,
  typeUrl: string,
  scheduleUrls: string[]
) => {
  const existingImage = await getResourceByTitle<ApiImage>("images", title);

  const url = existingImage
    ? `/api/images/${existingImage.uid}`
    : `/api/images/`;
  const res = await authenticatedSkylarkRequest(url, {
    method: existingImage ? "PUT" : "POST",
    data: {
      ...existingImage,
      image_type_url: typeUrl,
      title,
      schedule_urls: scheduleUrls,
      image_location: imageLocation,
      content_url: contentUrl,
    },
  });
  return res.data as ApiImage;
};

export const createOrUpdateRole = async (
  title: string,
  scheduleUrls: string[]
) => {
  const existingRole = await getResourceByTitle<ApiRole>("roles", title);

  const url = existingRole ? `/api/roles/${existingRole.uid}` : `/api/roles/`;
  const res = await authenticatedSkylarkRequest(url, {
    method: existingRole ? "PUT" : "POST",
    data: {
      ...existingRole,
      title,
      schedule_urls: scheduleUrls,
    },
  });
  return res.data as ApiRole;
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

export const createDynamicObject = async (
  { name, resource, query }: DynamicObjectConfig,
  metadata: Metadata
) => {
  const existingDynamicObject = await getDynamicObjectByName(name);

  const url = existingDynamicObject
    ? `/api/computed-scheduled-items/${existingDynamicObject.uid}`
    : "/api/computed-scheduled-items/";
  await authenticatedSkylarkRequest(url, {
    method: existingDynamicObject ? "PUT" : "POST",
    data: {
      uid: "",
      self: "",
      name,
      url: `/api/${resource}/?order=-created&q=${query}`,
      schedule_urls: [metadata.schedules.always.self],
    },
  });
};
