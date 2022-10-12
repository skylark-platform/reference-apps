import { graphQLClient } from "@skylark-reference-apps/lib";
import { renderHook, act } from "@testing-library/react-hooks";
import { useSWRConfig } from "swr";

import { useGenreListing } from "../../hooks/useGenreListing";
import { GenreListing } from "../../types/gql";

jest.spyOn(graphQLClient, "request");

describe("useGenreListing", () => {
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
    const mockedGraphQLResponse: { listGenre: GenreListing } = {
      listGenre: {
        objects: [],
      },
    };

    graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

    const { waitForNextUpdate } = renderHook(useGenreListing);

    await waitForNextUpdate();

    expect(graphQlRequest).toBeCalledWith(
      'query listGenre { listGenre (next_token: "", dimensions: [{dimension: "device-types", value: ""}, {dimension: "customer-types", value: "standard"}]) { next_token objects { uid name } } }'
    );
  });

  it("makes a second request with a next_token when one returned in the first request", async () => {
    const mockedGraphQLResponse: { listGenre: GenreListing } = {
      listGenre: {
        next_token: "token",
        objects: [],
      },
    };

    graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

    const { waitForNextUpdate } = renderHook(useGenreListing);

    await waitForNextUpdate();

    expect(graphQlRequest).toBeCalledTimes(2);
    expect(graphQlRequest).toBeCalledWith(
      'query listGenre { listGenre (next_token: "token", dimensions: [{dimension: "device-types", value: ""}, {dimension: "customer-types", value: "standard"}]) { next_token objects { uid name } } }'
    );
  });

  it("returns a the paginatinated response combined into a single array", async () => {
    const genres = Array.from({ length: 18 }, (__, index) => ({
      uid: `genre-${index}`,
    }));

    graphQlRequest.mockResolvedValueOnce({
      listGenre: {
        next_token: "token",
        objects: genres.slice(0, 10),
      },
    });
    graphQlRequest.mockResolvedValueOnce({
      listGenre: {
        objects: genres.slice(10, 18),
      },
    });

    const { result, waitForNextUpdate } = renderHook(useGenreListing);

    await waitForNextUpdate();
    expect(result.current.genres).toEqual(genres);
  });

  it("returns an error when the GraphQL request errors", async () => {
    graphQlRequest.mockRejectedValueOnce("graphql error");

    const { result, waitForNextUpdate } = renderHook(useGenreListing);

    await waitForNextUpdate();

    expect(result.current.isError).toBe("graphql error");
  });
});
