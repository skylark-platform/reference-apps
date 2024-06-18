import { DimensionKey } from "../interfaces";

export const SKYLARK_API = (process.env.NEXT_PUBLIC_SKYLARK_API_URL ||
  process.env.SKYLARK_API_URL) as string;

export const SAAS_API_ENDPOINT = (process.env.NEXT_PUBLIC_SAAS_API_ENDPOINT ||
  process.env.SAAS_API_ENDPOINT) as string;
export const SAAS_API_KEY = (process.env.NEXT_PUBLIC_SAAS_API_KEY ||
  process.env.SAAS_API_KEY) as string;
export const LOCAL_STORAGE = {
  uri: "skylarktv:uri",
  apikey: "skylarktv:apikey",
};
export const CLOUDINARY_ENVIRONMENT = process.env
  .NEXT_PUBLIC_CLOUDINARY_ENVIRONMENT as string;

export const ALL_DIMENSION_QUERY_KEYS: DimensionKey[] =
  Object.values(DimensionKey);
