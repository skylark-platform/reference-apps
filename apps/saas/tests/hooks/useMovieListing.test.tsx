import { graphQLClient } from "@skylark-reference-apps/lib";
import { renderHook, act } from "@testing-library/react-hooks";
import { useSWRConfig } from "swr";

import { useMovieListing } from "../../hooks/useMovieListing";
import { MovieListing } from "../../types/gql";

jest.spyOn(graphQLClient, "request");

describe("useMovieListing", () => {
  let graphQlRequest: jest.Mock;

  beforeEach(() => {
    graphQlRequest = graphQLClient.request as jest.Mock;

    const { result } = renderHook(useSWRConfig);
    act(() => {
      result.current.cache.clear();
    });

    jest.useFakeTimers({
      legacyFakeTimers: true,
    });
    act(() => {
      jest.runAllTimers();
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("makes a request with the expected query", async () => {
    const mockedGraphQLResponse: { listMovie: MovieListing } = {
      listMovie: {
        objects: [],
      },
    };

    graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

    const { waitForNextUpdate } = renderHook(useMovieListing);

    await waitForNextUpdate();

    expect(graphQlRequest).toBeCalledWith(
      'query listMovie { listMovie (next_token: "", language: "en-gb", dimensions: [{dimension: "device-types", value: ""}, {dimension: "customer-types", value: "standard"}]) { next_token objects { uid } } }',
      {},
      {}
    );
  });

  it("makes a second request with a next_token when one returned in the first request", async () => {
    const mockedGraphQLResponse: { listMovie: MovieListing } = {
      listMovie: {
        next_token: "token",
        objects: [],
      },
    };

    graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

    const { waitForNextUpdate } = renderHook(useMovieListing);

    await waitForNextUpdate();

    expect(graphQlRequest).toBeCalledTimes(2);
    expect(graphQlRequest).toBeCalledWith(
      'query listMovie { listMovie (next_token: "token", language: "en-gb", dimensions: [{dimension: "device-types", value: ""}, {dimension: "customer-types", value: "standard"}]) { next_token objects { uid } } }',
      {},
      {}
    );
  });

  it("returns a the paginatinated response combined into a single array", async () => {
    const movies = Array.from({ length: 18 }, (__, index) => ({
      uid: `movie-${index}`,
    }));

    graphQlRequest.mockResolvedValueOnce({
      listMovie: {
        next_token: "token",
        objects: movies.slice(0, 10),
      },
    });
    graphQlRequest.mockResolvedValueOnce({
      listMovie: {
        objects: movies.slice(10, 18),
      },
    });

    const { result, waitForNextUpdate } = renderHook(useMovieListing);

    await waitForNextUpdate();
    expect(result.current.movies).toEqual(movies);
  });

  it("does not make a request when disabled is true", () => {
    const mockedGraphQLResponse: { listMovie: MovieListing } = {
      listMovie: {
        next_token: "token",
        objects: [],
      },
    };

    graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

    renderHook(() => useMovieListing(true));

    expect(graphQlRequest).not.toBeCalled();
  });

  it("returns an error when the GraphQL request errors", async () => {
    graphQlRequest.mockRejectedValueOnce("graphql error");

    const { result, waitForNextUpdate } = renderHook(useMovieListing);

    await waitForNextUpdate();

    expect(result.current.isError).toBe("graphql error");
  });
});
