import {
  GraphQLClient,
  RequestDocument,
  Variables,
  request,
} from "graphql-request";
import { SAAS_API_ENDPOINT, SAAS_API_KEY } from "../../constants/env";

class SkylarkGraphQLClient extends GraphQLClient {
  uncachedRequest<T>(
    document: RequestDocument,
    variables?: Variables | undefined,
    requestHeaders?: HeadersInit | undefined,
  ) {
    return this.request<T>(document, variables, {
      ...requestHeaders,
      "x-bypass-cache": "1",
    });
  }
}

export const graphQLClient = new SkylarkGraphQLClient(SAAS_API_ENDPOINT, {
  headers: {
    Authorization: SAAS_API_KEY,
  },
});

export const skylarkRequest = <T>(
  uri: string,
  apiKey: string,
  query: string,
  variables: Variables,
  headers: object,
) =>
  request<T>(uri, query, variables, {
    ...headers,
    Authorization: apiKey,
  });
