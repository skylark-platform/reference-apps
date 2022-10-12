import {
  graphQLClient,
  GraphQLMediaObjectTypes,
} from "@skylark-reference-apps/lib";
import { renderHook, act } from "@testing-library/react-hooks";
import { useSWRConfig } from "swr";

import { useSingleObjectRelationships } from "../../hooks/useSingleObjectRelationships";

jest.spyOn(graphQLClient, "request");

describe("useSingleObject", () => {
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

  ["Episode", "Movie", "Brand", "Season"].forEach((type) => {
    it(`makes a get${type} request when the type is ${type}`, async () => {
      const method = `get${type}`;
      graphQlRequest.mockResolvedValueOnce({ [method]: {} });

      const { waitForNextUpdate } = renderHook(() =>
        useSingleObjectRelationships(type as GraphQLMediaObjectTypes, "uid")
      );

      await waitForNextUpdate();

      expect(graphQlRequest).toBeCalledWith(
        expect.stringContaining(`query ${method} { ${method} (uid: "uid"`)
      );
    });

    it(`requests default fields when the type is ${type}`, async () => {
      const method = `get${type}`;
      graphQlRequest.mockResolvedValueOnce({ [method]: {} });

      const { waitForNextUpdate } = renderHook(() =>
        useSingleObjectRelationships(type as GraphQLMediaObjectTypes, "uid")
      );

      await waitForNextUpdate();

      expect(graphQlRequest).toBeCalledWith(
        expect.stringContaining("{ images { objects { title type url } }")
      );
    });
  });

  it("uses the external_id field to lookup the Episode when the uid starts with rec (Airtable record ID)", async () => {
    graphQlRequest.mockResolvedValueOnce({ getEpisode: {} });

    const { waitForNextUpdate } = renderHook(() =>
      useSingleObjectRelationships("Episode", "reclskjdf")
    );

    await waitForNextUpdate();

    expect(graphQlRequest).toBeCalledWith(
      expect.stringContaining(
        `query getEpisode { getEpisode (external_id: "reclskjdf"`
      )
    );
  });

  it("requests additional fields for Episode", async () => {
    graphQlRequest.mockResolvedValueOnce({ getEpisode: {} });

    const { waitForNextUpdate } = renderHook(() =>
      useSingleObjectRelationships("Episode", "uid")
    );

    await waitForNextUpdate();

    expect(graphQlRequest).toBeCalledWith(
      expect.stringContaining(
        "credits { objects { character people { objects { name } } roles { objects { title } } } }"
      )
    );
    expect(graphQlRequest).toBeCalledWith(
      expect.stringContaining("themes { objects { name } }")
    );
    expect(graphQlRequest).toBeCalledWith(
      expect.stringContaining("genres { objects { name } }")
    );
    expect(graphQlRequest).toBeCalledWith(
      expect.stringContaining("ratings { objects { value } }")
    );
    expect(graphQlRequest).toBeCalledWith(
      expect.stringContaining(
        "seasons { objects { season_number brands { objects { title_short title_medium title_long } } } }"
      )
    );
  });

  it("requests additional fields for Movie", async () => {
    graphQlRequest.mockResolvedValueOnce({ getMovie: {} });

    const { waitForNextUpdate } = renderHook(() =>
      useSingleObjectRelationships("Movie", "uid")
    );

    await waitForNextUpdate();

    expect(graphQlRequest).toBeCalledWith(
      expect.stringContaining(
        "credits { objects { character people { objects { name } } roles { objects { title } } } }"
      )
    );
    expect(graphQlRequest).toBeCalledWith(
      expect.stringContaining("themes { objects { name } }")
    );
    expect(graphQlRequest).toBeCalledWith(
      expect.stringContaining("genres { objects { name } }")
    );
    expect(graphQlRequest).toBeCalledWith(
      expect.stringContaining("ratings { objects { value } }")
    );
    expect(graphQlRequest).toBeCalledWith(
      expect.stringContaining(
        "brands { objects { title_short title_medium title_long } }"
      )
    );
  });

  it("requests additional fields for Brand", async () => {
    graphQlRequest.mockResolvedValueOnce({ getBrand: {} });

    const { waitForNextUpdate } = renderHook(() =>
      useSingleObjectRelationships("Brand", "uid")
    );

    await waitForNextUpdate();

    expect(graphQlRequest).toBeCalledWith(
      expect.stringContaining("tags { objects { name } }")
    );
    expect(graphQlRequest).toBeCalledWith(
      expect.stringContaining(
        "seasons { objects { title_short title_medium title_long season_number number_of_episodes episodes { objects { uid episode_number } } } }"
      )
    );
  });

  it("returns an error when the GraphQL request errors", async () => {
    const err = new Error("graphql error");
    graphQlRequest.mockRejectedValueOnce(err);

    const { result, waitForNextUpdate } = renderHook(() =>
      useSingleObjectRelationships("Episode", "123")
    );

    await waitForNextUpdate();

    expect(result.current.isError).toBe(err);
  });
});
