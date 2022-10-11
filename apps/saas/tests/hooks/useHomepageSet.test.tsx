import { graphQLClient } from "@skylark-reference-apps/lib";
import { renderHook, act } from "@testing-library/react-hooks";
import { useSWRConfig } from "swr";

import { useHomepageSet } from "../../hooks/useHomepageSet";
import { GenreListing } from "../../types/gql";

jest.spyOn(graphQLClient, "request");

describe("useHomepageSet", () => {
  let graphQlRequest: jest.Mock;

  beforeEach(() => {
    graphQlRequest = graphQLClient.request as jest.Mock;

    const { result } = renderHook(useSWRConfig);
    act(() => {
      result.current.cache.clear();
    });

    jest.useFakeTimers();
    act(() => {
      jest.runAllTimers();
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("makes a request with the expected query", async () => {
    const mockedGraphQLResponse: { getSet: GenreListing } = {
      getSet: {},
    };

    graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

    const { waitForNextUpdate } = renderHook(useHomepageSet);

    await waitForNextUpdate();

    expect(graphQlRequest).toBeCalledWith(
      'query getSet { getSet (external_id: "ingestor_set_media_reference_homepage", language: "en-gb", dimensions: [{dimension: "device-types", value: ""}, {dimension: "customer-types", value: "standard"}]) { __typename uid title slug content { count objects { object { __typename slug ... on Season { uid title_short title_medium episodes (limit: 30) { objects { uid episode_number title } } } ... on Set { uid type title_short title_medium content (limit: 30) { objects { object { __typename uid } } } } } } } } }'
    );
  });

  it("returns an error when the GraphQL request errors", async () => {
    graphQlRequest.mockRejectedValueOnce("graphql error");

    const { result, waitForNextUpdate } = renderHook(useHomepageSet);

    await waitForNextUpdate();

    expect(result.current.isError).toBe("graphql error");
  });
});
