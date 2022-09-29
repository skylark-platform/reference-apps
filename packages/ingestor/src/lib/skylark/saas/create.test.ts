import { FieldSet, Records, Record, Table } from "airtable";
import { GraphQLMetadata } from "../../interfaces";
import {
  createGraphQLMediaObjects,
  createOrUpdateGraphQLCredits,
  createOrUpdateGraphQlObjectsUsingIntrospection,
} from "./create";
import { graphQLClient } from "./graphql";

jest.mock("./graphql.ts");

describe("saas/create.ts", () => {
  let graphQlRequest: jest.Mock;

  beforeEach(() => {
    graphQlRequest = graphQLClient.request as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("createOrUpdateGraphQlObjectsUsingIntrospection", () => {
    const records: Partial<Record<FieldSet>>[] = [
      {
        id: "brand_1",
        fields: {
          title: "Brand 1",
        },
      },
    ];

    beforeEach(() => {
      const mockedGraphQLResponse = {
        __type: {
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
      graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);
    });

    it("makes a request to check whether the brand exists", async () => {
      await createOrUpdateGraphQlObjectsUsingIntrospection(
        "Brand",
        records as Records<FieldSet>
      );
      expect(graphQLClient.request).toHaveBeenNthCalledWith(
        2,
        'query getBrands { brand_1: getBrand (ignore_availability: true, external_id: "brand_1") { uid external_id } }'
      );
    });

    it("makes a request to create the brand when it does not exist", async () => {
      const mockedGraphQLResponse = {
        response: {
          data: {
            brand_1: null,
          },
        },
      };
      graphQlRequest.mockRejectedValueOnce(mockedGraphQLResponse);

      await createOrUpdateGraphQlObjectsUsingIntrospection(
        "Brand",
        records as Records<FieldSet>
      );
      expect(graphQLClient.request).toHaveBeenNthCalledWith(
        3,
        'mutation createOrUpdateBrands { createBrandbrand_1: createBrand (brand: {title: "Brand 1", external_id: "brand_1"}) { uid external_id } }'
      );
    });

    it("makes a request to update the brand when it exists", async () => {
      await createOrUpdateGraphQlObjectsUsingIntrospection(
        "Brand",
        records as Records<FieldSet>
      );
      expect(graphQLClient.request).toHaveBeenNthCalledWith(
        3,
        'mutation createOrUpdateBrands { updateBrandbrand_1: updateBrand (external_id: "brand_1", brand: {title: "Brand 1"}) { uid external_id } }'
      );
    });

    it("makes two requests when more than 20 records are sent", async () => {
      const manyRecords: Partial<Record<FieldSet>>[] = Array.from(
        { length: 30 },
        (_, index) => ({
          id: `brand_${index + 1}`,
          fields: {
            title: `Brand ${index + 1}`,
            slug: `brand-${index + 1}`,
          },
        })
      );

      await createOrUpdateGraphQlObjectsUsingIntrospection(
        "Brand",
        manyRecords as Records<FieldSet>
      );
      expect(graphQlRequest).toHaveBeenCalledTimes(4);
      expect(graphQlRequest).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("mutation createOrUpdateBrands_chunk_1")
      );
      expect(graphQlRequest).toHaveBeenNthCalledWith(
        4,
        expect.stringContaining("mutation createOrUpdateBrands_chunk_2")
      );
    });
  });

  describe("createOrUpdateGraphQLCredits", () => {
    const records: Partial<Record<FieldSet>>[] = [
      {
        id: "credit_1",
        fields: {
          title: "Credit 1",
          person: ["ext_person_1"],
          role: ["ext_role_1"],
        },
      },
    ];

    const metadata: Partial<GraphQLMetadata> = {
      roles: [
        {
          uid: "role_1",
          external_id: "ext_role_1",
          slug: "role-1",
        },
      ],
      people: [
        {
          uid: "person_1",
          external_id: "ext_person_1",
          slug: "person-1",
        },
      ],
    };

    beforeEach(() => {
      const mockedGraphQLResponse = {
        __type: {
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
      graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);
    });

    it("makes a request to check whether the Credit exists", async () => {
      await createOrUpdateGraphQLCredits(
        records as Records<FieldSet>,
        metadata as GraphQLMetadata
      );
      expect(graphQLClient.request).toHaveBeenNthCalledWith(
        2,
        'query getCredits { credit_1: getCredit (ignore_availability: true, external_id: "credit_1") { uid external_id } }'
      );
    });

    it("makes a request to create the Credit when it does not exist", async () => {
      const mockedGraphQLResponse = {
        response: {
          data: {
            credit_1: null,
          },
        },
      };
      graphQlRequest.mockRejectedValueOnce(mockedGraphQLResponse);

      await createOrUpdateGraphQLCredits(
        records as Records<FieldSet>,
        metadata as GraphQLMetadata
      );
      expect(graphQLClient.request).toHaveBeenNthCalledWith(
        3,
        'mutation createOrUpdateCredits { createCreditcredit_1: createCredit (credit: {relationships: {people: {link: "person_1"}, roles: {link: "role_1"}}, title: "Credit 1", external_id: "credit_1"}) { uid external_id } }'
      );
    });

    it("makes a request to update the Credit when it exists", async () => {
      await createOrUpdateGraphQLCredits(
        records as Records<FieldSet>,
        metadata as GraphQLMetadata
      );
      expect(graphQLClient.request).toHaveBeenNthCalledWith(
        3,
        'mutation createOrUpdateCredits { updateCreditcredit_1: updateCredit (external_id: "credit_1", credit: {relationships: {people: {link: "person_1"}, roles: {link: "role_1"}}, title: "Credit 1"}) { uid external_id } }'
      );
    });
  });

  // describe("createGraphQLMediaObjects", () => {

  // })

  describe("createOrUpdateAirtableObjectsInSkylarkWithParentsInSameTable", () => {
    const table = { name: "episodes" } as Table<FieldSet>;
    const airtableEpisodeRecords: Partial<Record<FieldSet>>[] = [
      {
        id: "airtable-episode-1",
        _table: table,
        fields: {
          title: "episode-1",
          slug: "episode-1",
          title_short: "short title",
        },
      },
      {
        id: "airtable-episode-2",
        _table: table,
        fields: {
          title: "episode-2",
          slug: "episode-2",
          synopsis_short: "short synopsis",
        },
      },
    ];

    const metadata: GraphQLMetadata = {
      airtableImages: [],
      roles: [
        {
          uid: "role_1",
          external_id: "ext_role_1",
          slug: "role-1",
        },
      ],
      people: [
        {
          uid: "person_1",
          external_id: "ext_person_1",
          slug: "person-1",
        },
      ],
      credits: [
        {
          uid: "credit_1",
          external_id: "ext_credit_1",
          slug: "credit-1",
        },
      ],
      themes: [
        {
          uid: "theme_1",
          external_id: "ext_theme_1",
          slug: "theme-1",
        },
      ],
      genres: [
        {
          uid: "genre_1",
          external_id: "ext_genre_1",
          slug: "genre-1",
        },
      ],
      tags: [
        {
          uid: "tag_1",
          external_id: "ext_tag_1",
          slug: "tag-1",
        },
      ],
      ratings: [
        {
          uid: "rating_1",
          external_id: "ext_rating_1",
          slug: "rating-1",
        },
      ],
    };

    it("does nothing when no airtable records are given", async () => {
      // Arrange.
      const mockedGraphQLResponse = {
        __type: {
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
      graphQlRequest.mockResolvedValue(mockedGraphQLResponse);

      // Act.
      const records = await createGraphQLMediaObjects([], metadata);

      // Assert.
      expect(records).toEqual([]);
    });

    it("calls Skylark 11 times when all records don't have parents", async () => {
      // Arrange.
      const mockedIntrospectionResponse = {
        __type: {
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
      const mockedGetEpisodesResponse = {
        response: {
          data: {
            "airtable-episode-1": null,
            "airtable-episode-2": null,
          },
        },
      };
      const mockedGraphQLResponse = {
        "airtable-episode-1": { external_id: "airtable-episode-1" },
        "airtable-episode-2": { external_id: "airtable-episode-2" },
      };

      graphQlRequest.mockImplementation(() => {
        if (graphQlRequest.mock.calls.length <= 5) {
          return mockedIntrospectionResponse;
        }
        if (graphQlRequest.mock.calls.length === 6) {
          return mockedGetEpisodesResponse;
        }
        return mockedGraphQLResponse;
      });

      // Act.
      await createGraphQLMediaObjects(
        airtableEpisodeRecords as Record<FieldSet>[],
        metadata
      );

      // Assert.
      expect(graphQlRequest).toHaveBeenCalledTimes(11);
      expect(graphQlRequest).toHaveBeenNthCalledWith(
        11,
        'mutation createMediaObjects { updateBrand_airtable-episode-1: updateBrand (external_id: "airtable-episode-1", brand: {title: "episode-1", relationships: {}}) { __typename uid external_id title slug } updateBrand_airtable-episode-2: updateBrand (external_id: "airtable-episode-2", brand: {title: "episode-2", relationships: {}}) { __typename uid external_id title slug } }'
      );
    });

    it("creates the relationships", async () => {
      // Arrange.
      const airtableRecordWithRelationships: Partial<Record<FieldSet>>[] = [
        {
          id: "airtable-episode-1",
          _table: table,
          fields: {
            title: "episode with relationships",
            slug: "episode-relationships",
            themes: [metadata.themes[0].external_id],
            genres: [metadata.genres[0].external_id],
            ratings: [metadata.ratings[0].external_id],
            tags: [metadata.tags[0].external_id],
            credits: [metadata.credits[0].external_id],
          },
        },
      ];

      const mockedIntrospectionResponse = {
        __type: {
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
      const mockedGetEpisodesResponse = {
        response: {
          data: {
            "airtable-episode-1": null,
          },
        },
      };
      const mockedGraphQLResponse = {
        "airtable-episode-1": { external_id: "airtable-episode-1" },
      };

      graphQlRequest.mockImplementation(() => {
        if (graphQlRequest.mock.calls.length <= 5) {
          return mockedIntrospectionResponse;
        }
        if (graphQlRequest.mock.calls.length === 6) {
          return mockedGetEpisodesResponse;
        }
        return mockedGraphQLResponse;
      });

      // Act.
      await createGraphQLMediaObjects(
        airtableRecordWithRelationships as Record<FieldSet>[],
        metadata
      );

      // Assert.
      expect(graphQlRequest).toHaveBeenCalledTimes(11);
      expect(graphQlRequest).toHaveBeenNthCalledWith(
        11,
        'mutation createMediaObjects { updateBrand_airtable-episode-1: updateBrand (external_id: "airtable-episode-1", brand: {title: "episode with relationships", relationships: {themes: {link: ["theme_1"]}, genres: {link: ["genre_1"]}, ratings: {link: ["rating_1"]}, tags: {link: ["tag_1"]}, credits: {link: ["credit_1"]}}}) { __typename uid external_id title slug } }'
      );
    });

    it("calls Axios five times when one record has a parent", async () => {
      // Arrange.
      const airtableRecordsWithParentField = [
        ...airtableEpisodeRecords,
        {
          id: "airtable-episode-3",
          _table: table,
          fields: {
            title: "episode 3",
            slug: "episode-3",
            synopsis_short: "short synopsis",
            parent: ["airtable-episode-1"],
          },
        },
      ];

      const mockedIntrospectionResponse = {
        __type: {
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
      const mockedGetEpisodesResponse = {
        response: {
          data: {
            "airtable-episode-1": null,
            "airtable-episode-2": null,
          },
        },
      };
      const mockedGraphQLResponse = {
        "airtable-episode-1": { external_id: "airtable-episode-1" },
        "airtable-episode-2": { external_id: "airtable-episode-2" },
      };

      graphQlRequest.mockImplementation(() => {
        if (graphQlRequest.mock.calls.length <= 5) {
          return mockedIntrospectionResponse;
        }
        if (graphQlRequest.mock.calls.length === 6) {
          return mockedGetEpisodesResponse;
        }
        return mockedGraphQLResponse;
      });

      // Act.
      await createGraphQLMediaObjects(
        airtableRecordsWithParentField as Record<FieldSet>[],
        metadata
      );

      // Assert.
      expect(graphQlRequest).toHaveBeenCalledTimes(12);
      expect(graphQlRequest).toHaveBeenNthCalledWith(
        12,
        'mutation createMediaObjects { updateBrand_airtable-episode-3: updateBrand (external_id: "airtable-episode-3", brand: {title: "episode 3", relationships: {brands: {link: undefined}}}) { __typename uid external_id title slug } }'
      );
    });
  });
});
