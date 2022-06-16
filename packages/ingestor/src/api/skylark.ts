import { ApiEntertainmentObject, ApiImage, ApiImageType, ApiSchedule, ApiSetType, SKYLARK_API } from "@skylark-reference-apps/lib";
import axios, { AxiosRequestConfig } from "axios"
import { getToken } from "../cognito"

export type ApiEntertainmentObjectType =  "brands" | "seasons" | "episodes" | "movies";

const authenticatedSkylarkRequest = async<T>(path: string, config?: AxiosRequestConfig) => {
  const token = await getToken();
  const url = (new URL(path, SKYLARK_API)).toString();

  return axios.request<T>({
    ...config,
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
}

export const getAlwaysSchedule = async(): Promise<ApiSchedule> => {
  const res = await authenticatedSkylarkRequest<{ objects: ApiSchedule[] }>("/api/schedules/", {
    params: {
      slug: "always-licence",
    }
  })

  if(!res.data.objects || res.data.objects.length === 0) {
    throw new Error("Always schedule not found");
  }
  return res.data.objects[0];
}

export const getImageTypes = async(): Promise<ApiImageType[]> => {
  const res = await authenticatedSkylarkRequest<{ objects: ApiImageType[] }>("/api/image-types/");
  return res.data.objects;
}

export const getSetTypes = async(): Promise<ApiSetType[]> => {
  const res = await authenticatedSkylarkRequest<{ objects: ApiSetType[] }>("/api/set-types/");
  return res.data.objects;
}

export const getEntertainmentObjectBySlug = async(type: ApiEntertainmentObjectType, slug: string): Promise<ApiEntertainmentObject | null> => {
  const res = await authenticatedSkylarkRequest<{ objects: ApiEntertainmentObject[] }>(`/api/${type}/?slug=${slug}`, {
    method: "GET",
  });

  if(!res.data.objects || res.data.objects.length === 0) {
    return null;
  }
  return res.data.objects[0];
}

export const createEntertainmentObject = async(type: ApiEntertainmentObjectType, object: ApiEntertainmentObject) => {
  const res = await authenticatedSkylarkRequest(`/api/${type}/`, {
    method: "POST",
    data: object,
  })
  return res.data as ApiEntertainmentObject;
}

export const updateEntertainmentObject = async(type: ApiEntertainmentObjectType, object: ApiEntertainmentObject) => {
  if(!object.uid) {
    throw new Error("Object UID cannot be empty in an update");
  }

  const res = await authenticatedSkylarkRequest(`/api/${type}/${object.uid}`, {
    method: "PATCH",
    data: object,
  })
  return res.data as ApiEntertainmentObject;

}

export const createOrUpdateEntertainmentObject = async(type: ApiEntertainmentObjectType, object: ApiEntertainmentObject) => {
  const existingObject = await getEntertainmentObjectBySlug(type, object.slug);
  if(existingObject) {
    return updateEntertainmentObject(type, {
      ...object,
      uid: existingObject.uid,
      self: existingObject.self,
    });
  }
  return createEntertainmentObject(type, object);
}

export const getImageByTitle = async(title: string) => {
  const res = await authenticatedSkylarkRequest<{ objects: ApiImage[] }>(`/api/images/?title=${title}`, {
    method: "GET",
  });

  if(!res.data.objects || res.data.objects.length === 0) {
    return null;
  }
  return res.data.objects[0];
}

export const createImage = async(title: string, imageLocation: string, contentUrl: string, typeUrl: string, scheduleUrls: string[]) => {
  const existingImage = await getImageByTitle(title);

  const url = existingImage ? `/api/images/${existingImage.uid}` : `/api/images/`;
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
  })
  return res.data as ApiImage;
}
