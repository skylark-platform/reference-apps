import { graphQLClient } from "@skylark-reference-apps/lib";
import { FieldSet, Record, Records } from "airtable";
import {
  GraphQLBaseObject,
  GraphQLMetadata,
  SetConfig,
} from "../../interfaces";
import { ApiObjectType } from "../../types";
import { createOrUpdateGraphQLSet } from "./sets";

jest.mock("@skylark-reference-apps/lib");

describe("saas/sets.ts", () => {
  let graphQlRequest: jest.Mock;

  beforeEach(() => {
    graphQlRequest = graphQLClient.request as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const setConfig: SetConfig = {
    dataSourceId: "home-page-slider",
    externalId: "home_page_slider",
    title: "Home page hero",
    slug: "media-reference-home-page-hero",
    set_type_slug: "slider",
    graphQlSetType: "SLIDER",
    contents: [
      { type: "brands", slug: "game-of-thrones" },
      { type: "movies", slug: "deadpool-2" },
      { type: "movies", slug: "sing-2" },
      { type: "movies", slug: "us" },
      { type: "episodes", slug: "Game of Thrones S01E01" },
      { type: "seasons", slug: "Game of Thrones S01" },
      { type: "assets", slug: "Random movie" },
    ],
  };

  const mediaObjects: GraphQLBaseObject[] = setConfig.contents.map(
    (content) => {
      const { type, slug } = content as { type: ApiObjectType; slug: string };
      return {
        external_id: `${type}-${slug}`,
        uid: `${type}-${slug}`,
        slug,
      };
    }
  );

  const metadata: Partial<GraphQLMetadata> = {};

  const languagesTable: Partial<Record<FieldSet>>[] = [
    {
      id: "language-1",
      fields: {
        title: "English (United Kingdom)",
        slug: "eng-uk",
        code: "en-GB",
      },
    },
  ];

  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip("createOrUpdateGraphQLSet", () => {
    beforeEach(() => {
      const mockedIntrospectionResponse = {
        IntrospectionOnType: {
          fields: [
            {
              name: "title",
              type: {
                name: "String",
                kind: "SCALAR",
              },
            },
          ],
        },
      };
      graphQlRequest.mockResolvedValueOnce(mockedIntrospectionResponse);
    });

    it("makes a request to create a set containing various media objects", async () => {
      const mockedGetResponse = {
        response: {
          data: {
            home_page_slider: null,
          },
        },
      };
      graphQlRequest.mockRejectedValueOnce(mockedGetResponse);

      const mockedCreateResponse = {
        createSet: {},
      };
      graphQlRequest.mockResolvedValueOnce(mockedCreateResponse);

      await createOrUpdateGraphQLSet(
        setConfig,
        mediaObjects,
        metadata as GraphQLMetadata,
        languagesTable as Records<FieldSet>,
        [] as Records<FieldSet>
      );
      expect(graphQlRequest).toBeCalledWith(
        'mutation { createSet: createSet (set: {external_id: "home_page_slider", content: {Episode: {link: [{position: 5, uid: "episodes-Game of Thrones S01E01"}]}, Season: {link: [{position: 6, uid: "seasons-Game of Thrones S01"}]}, Brand: {link: [{position: 1, uid: "brands-game-of-thrones"}]}, Movie: {link: [{position: 2, uid: "movies-deadpool-2"}, {position: 3, uid: "movies-sing-2"}, {position: 4, uid: "movies-us"}]}, Set: {link: []}}, title: "Home page hero"}) { uid external_id slug } }'
      );
    });

    it("returns an empty object when attempting the set exists as update is not implemented", async () => {
      const got = await createOrUpdateGraphQLSet(
        setConfig,
        mediaObjects,
        metadata as GraphQLMetadata,
        languagesTable as Records<FieldSet>,
        [] as Records<FieldSet>
      );
      expect(got).toEqual({});
    });
  });
});
