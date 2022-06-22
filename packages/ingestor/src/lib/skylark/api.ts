import { SKYLARK_API } from "@skylark-reference-apps/lib";
import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "../cognito";

/**
 * authenticatedSkylarkRequest - makes a request to Skylark using the Bearer token from Amplify
 * @param path - Skylark path
 * @param config - Axios config
 * @returns Axios Request
 */
export const authenticatedSkylarkRequest = async <T>(
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
      "Cache-Control": "no-cache",
    },
  });
};
