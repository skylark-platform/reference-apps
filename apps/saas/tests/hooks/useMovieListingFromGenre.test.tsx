import { graphQLClient } from "@skylark-reference-apps/lib";
import { renderHook, act } from "@testing-library/react-hooks";
import { useSWRConfig } from "swr";

import { useMovieListingFromGenre } from "../../hooks/useMovieListingFromGenre";
import { Genre, MovieListing } from "../../types/gql";

jest.spyOn(graphQLClient, "request");

describe("useMovieListingFromGenre", () => {
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

  it("does not make a request when no uid is passed in", () => {
    const mockedGraphQLResponse: { listMovie: MovieListing } = {
      listMovie: {
        next_token: "token",
        objects: [],
      },
    };

    graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

    renderHook(() => useMovieListingFromGenre(""));

    expect(graphQlRequest).not.toBeCalled();
  });

  it("makes a request with the expected query", async () => {
    const mockedGraphQLResponse: { getGenre: Genre } = {
      getGenre: {
        uid: "genre-1",
        movies: {
          next_token: "",
          objects: [],
        },
      },
    };

    graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

    const { waitForNextUpdate } = renderHook(() =>
      useMovieListingFromGenre("genreuid")
    );

    await waitForNextUpdate();

    expect(graphQlRequest).toBeCalledWith(
      'query getGenre { getGenre (uid: "genreuid", dimensions: [{dimension: "device-types", value: ""}, {dimension: "customer-types", value: "standard"}]) { movies (next_token: "", language: "en-gb") { next_token objects { uid } } } }',
      {},
      {}
    );
  });

  it("makes a second request with a next_token when one returned in the first request", async () => {
    const mockedGraphQLResponse: { getGenre: Genre } = {
      getGenre: {
        uid: "genre-1",
        movies: {
          next_token: "token",
          objects: [],
        },
      },
    };

    graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

    const { waitForNextUpdate } = renderHook(() =>
      useMovieListingFromGenre("genreuid")
    );

    await waitForNextUpdate();

    expect(graphQlRequest).toBeCalledTimes(2);
    expect(graphQlRequest).toBeCalledWith(
      'query getGenre { getGenre (uid: "genreuid", dimensions: [{dimension: "device-types", value: ""}, {dimension: "customer-types", value: "standard"}]) { movies (next_token: "token", language: "en-gb") { next_token objects { uid } } } }',
      {},
      {}
    );
  });

  it("returns a the paginatinated response combined into a single array", async () => {
    const movies = Array.from({ length: 18 }, (__, index) => ({
      uid: `movie-${index}`,
    }));

    graphQlRequest.mockResolvedValueOnce({
      getGenre: {
        movies: {
          next_token: "token",
          objects: movies.slice(0, 10),
        },
      },
    });
    graphQlRequest.mockResolvedValueOnce({
      getGenre: {
        movies: {
          objects: movies.slice(10, 18),
        },
      },
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useMovieListingFromGenre("genreuid")
    );

    await waitForNextUpdate();
    expect(result.current.movies).toEqual(movies);
  });

  it("returns an error when the GraphQL request errors", async () => {
    graphQlRequest.mockRejectedValueOnce("graphql error");

    const { result, waitForNextUpdate } = renderHook(() =>
      useMovieListingFromGenre("genreuid")
    );

    await waitForNextUpdate();

    expect(result.current.isError).toBe("graphql error");
  });
});
