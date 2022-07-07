import { ApiBatchResponse, SKYLARK_API } from "@skylark-reference-apps/lib";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
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
const checkBatchRequestWasSuccessful = ({
  id,
  code,
  body,
}: ApiBatchResponse) => {
  if (code < 200 || code > 299) {
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
  data: object[]
): Promise<{ batchRequestId: string; data: T }[]> => {
  const batchRes = await authenticatedSkylarkRequest<ApiBatchResponse[]>(
    "/api/batch/",
    {
      method: "POST",
      data,
    }
  );

  batchRes.data.forEach(checkBatchRequestWasSuccessful);

  return batchRes.data.map(({ id, body }) => ({
    batchRequestId: id,
    data: JSON.parse(body) as T,
  }));
};
