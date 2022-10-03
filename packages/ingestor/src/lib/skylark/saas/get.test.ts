import { graphQLClient } from "@skylark-reference-apps/lib";

import { getExistingObjects, getValidPropertiesForObject } from "./get";

jest.mock("@skylark-reference-apps/lib");

describe("saas/get.ts", () => {
  let graphQlRequest: jest.Mock;

  beforeEach(() => {
    graphQlRequest = graphQLClient.request as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getValidPropertiesForObject", () => {
    it("makes a request with the expected query", async () => {
      const mockedGraphQLResponse = {
        __type: {
          fields: [],
        },
      };
      graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

      await getValidPropertiesForObject("Brand");

      expect(graphQlRequest).toBeCalledWith(
        'query Introspection { __type (name: "Brand") { name fields { name type { name kind } } } }'
      );
    });

    it("returns the expected fields (they are strings)", async () => {
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
            {
              name: "required-title",
              type: {
                name: "String!",
                kind: "SCALAR",
              },
            },
          ],
        },
      };
      graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

      const validProperties = await getValidPropertiesForObject("Brand");

      expect(validProperties).toEqual(["title", "required-title"]);
    });

    it("does not return any fields with kind OBJECT", async () => {
      const mockedGraphQLResponse = {
        __type: {
          fields: [
            {
              name: "theme",
              type: {
                name: "",
                kind: "OBJECT",
              },
            },
          ],
        },
      };
      graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

      const validProperties = await getValidPropertiesForObject("Brand");

      expect(validProperties).toEqual([]);
    });
  });

  describe("getExistingObjects", () => {
    it("makes a request with the expected query", async () => {
      await getExistingObjects("Brand", ["brand-1"]);

      expect(graphQlRequest).toBeCalledWith(
        'query getBrands { brand-1: getBrand (ignore_availability: true, external_id: "brand-1") { uid external_id } }'
      );
    });

    it("returns all given uids when the request does not error", async () => {
      const got = await getExistingObjects("Brand", [
        "brand-1",
        "brand-2",
        "brand-3",
      ]);
      expect(got).toEqual(["brand-1", "brand-2", "brand-3"]);
    });

    it("returns the uids that exist when some queries return a null value", async () => {
      const mockedGraphQLResponse = {
        response: {
          data: {
            "brand-1": null,
          },
        },
      };
      graphQlRequest.mockRejectedValueOnce(mockedGraphQLResponse);

      const got = await getExistingObjects("Brand", [
        "brand-1",
        "brand-2",
        "brand-3",
      ]);
      expect(got).toEqual(["brand-2", "brand-3"]);
    });

    it("rejects when an unexpected error occurs", async () => {
      graphQlRequest.mockRejectedValueOnce(new Error("Unexpected error"));
      await expect(
        getExistingObjects("Brand", ["brand-1", "brand-2", "brand-3"])
      ).rejects.toThrow("Unexpected error");
    });
  });
});
