import { ApiBatchResponse, SKYLARK_API } from "@skylark-reference-apps/lib";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { chunk } from "lodash";
import { getToken } from "../amplify";

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

  const headers: AxiosRequestHeaders = {
    "Cache-Control": "no-cache",
    ...config?.headers,
    Authorization: `Bearer ${token}`,
  };

  return axios.request<T>({
    ...config,
    url,
    headers,
  });
};

/**
 * checkBatchRequestWasSuccessful - helper function to check whether an individual batch operation was succesful
 * @param { code, body }
 */
const checkBatchRequestWasSuccessful = (
  { id, code, body }: ApiBatchResponse,
  ignore404s: boolean
) => {
  if (code < 200 || code > 299) {
    if (ignore404s && code === 404) return;
    throw new Error(
      `Batch request "${id}" failed with ${code}. Response body: ${body}`
    );
  }
};

/**
 * batchSkylarkRequest - uses the Skylark batch API endpoint to make bulk operations within Skylark
 * @param data - the batch data to execute with Skylark
 * @returns
 */
export const batchSkylarkRequest = async <T>(
  data: object[],
  config?: {
    ignore404s?: boolean;
  }
): Promise<{ batchRequestId: string; data: T; code: number }[]> => {
  const chunks = chunk(data, 10);

  const batchResArr = await Promise.all(
    chunks.map((chunkedData) =>
      authenticatedSkylarkRequest<ApiBatchResponse[]>("/api/batch/", {
        method: "POST",
        data: chunkedData,
      })
    )
  );

  const batchResData = batchResArr.flatMap((val) => val.data);

  batchResData.forEach((res) =>
    checkBatchRequestWasSuccessful(res, !!config?.ignore404s)
  );

  return batchResData.map(({ id, body, code }) => ({
    batchRequestId: id,
    code,
    data: code !== 404 ? (JSON.parse(body) as T) : ({} as T),
  }));
};
