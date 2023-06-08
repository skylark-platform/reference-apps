import request, { RequestDocument, Variables } from "graphql-request";

export const skylarkRequest = <T>({
  uri,
  token,
  query,
  variables,
}: {
  uri: string;
  token: string;
  query: RequestDocument | string;
  variables?: Variables;
}) => {
  const headers: HeadersInit = {
    Authorization: token,
  };

  console.log("Request to", uri, "with", { query, variables, headers });

  return request<T>(uri, query, variables, headers);
};
