import { graphQLClient } from "@skylark-reference-apps/lib";
import { FieldSet, Record, Records } from "airtable";
import {
  GraphQLBaseObject,
  GraphQLMetadata,
  SetConfig,
} from "../../interfaces";
import { createOrUpdateGraphQLSet } from "./sets";
import { gqlObjectMeta } from "./utils";

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
    externalId: "home_page_slider",
    title: "Home page hero",
    slug: "media-reference-home-page-hero",
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
      const { type, slug } = content as { type: string; slug: string };
      return {
        __typename: gqlObjectMeta(type).objectType,
        external_id: `${type}-${slug}`,
        uid: `${type}-${slug}`,
        slug,
      };
    }
  );

  const metadata: Partial<GraphQLMetadata> = {
    availability: {
      all: [],
      default: "availability-1",
    },
  };

  const languagesTable: Partial<Record<FieldSet>>[] = [
    {
      id: "language-1",
      fields: {
        code: "en-GB",
      },
    },
    {
      id: "language-2",
      fields: {
        code: "pt-PT",
      },
    },
  ];

  // eslint-disable-next-line jest/no-disabled-tests
  describe("createOrUpdateGraphQLSet", () => {
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
            {
              name: "title_short",
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

    describe("without translations", () => {
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
          createSkylarkSet: {},
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
          'mutation { createSkylarkSet_home_page_slider: createSkylarkSet (skylark_set: {title: "Home page hero", external_id: "home_page_slider", content: {Episode: {link: [{position: 5, uid: "episodes-Game of Thrones S01E01"}]}, Season: {link: [{position: 6, uid: "seasons-Game of Thrones S01"}]}, Brand: {link: [{position: 1, uid: "brands-game-of-thrones"}]}, Movie: {link: [{position: 2, uid: "movies-deadpool-2"}, {position: 3, uid: "movies-sing-2"}, {position: 4, uid: "movies-us"}]}, SkylarkSet: {link: []}}, availability: {link: ["availability-1"]}}) { __typename uid external_id slug } }'
        );
      });
    });

    describe("with translations", () => {
      const mockedGetResponse = {
        response: {
          data: {
            home_page_slider: null,
          },
        },
      };
      const mockedCreateResponse = {
        createSkylarkSet: {},
      };

      const translationsTable: Partial<Record<FieldSet>>[] = [
        {
          fields: {
            slug: setConfig.slug,
            language: ["language-1"],
            title_short: "English Title",
          },
        },
        {
          fields: {
            slug: setConfig.slug,
            language: ["language-2"],
            title_short: "Portuguese Title",
          },
        },
      ];

      it("the second language creation is an update and doesn't contain relationships or content", async () => {
        graphQlRequest.mockRejectedValueOnce(mockedGetResponse);
        graphQlRequest.mockResolvedValue(mockedCreateResponse);

        await createOrUpdateGraphQLSet(
          setConfig,
          mediaObjects,
          metadata as GraphQLMetadata,
          languagesTable as Records<FieldSet>,
          translationsTable as Records<FieldSet>
        );
        expect(graphQlRequest).toBeCalledTimes(6);
        expect(graphQlRequest).toHaveBeenNthCalledWith(
          6,
          'mutation { updateSkylarkSet_pt_PT_home_page_slider: updateSkylarkSet (external_id: "home_page_slider", language: "pt-PT", skylark_set: {title: "Home page hero", title_short: "Portuguese Title"}) { __typename uid external_id slug } }'
        );
      });
    });
  });
});
