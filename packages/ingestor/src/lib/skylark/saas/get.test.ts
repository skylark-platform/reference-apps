import { graphQLClient } from "@skylark-reference-apps/lib";

import { getExistingObjects, getValidPropertiesForObject } from "./get";

jest.mock("@skylark-reference-apps/lib");

describe("saas/get.ts", () => {
  let graphQlRequest: jest.Mock;

  beforeEach(() => {
    graphQlRequest = graphQLClient.uncachedRequest as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getValidPropertiesForObject", () => {
    it("makes two requests, one to get the Object's fields and one to get it's input fields", async () => {
      const mockedGraphQLResponse = {
        IntrospectionOnType: {
          fields: [],
        },
      };
      graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

      await getValidPropertiesForObject("Brand");

      expect(graphQlRequest).toBeCalledWith(
        'query { IntrospectionOnType: __type (name: "Brand") { name fields { name type { name kind } } } IntrospectionOnInputType: __type (name: "BrandInput") { name inputFields { name type { name kind } } } }',
        {}
      );
    });

    it("returns the expected fields (they are strings)", async () => {
      const mockedGraphQLResponse = {
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

      expect(validProperties).toEqual([
        { property: "title", kind: "SCALAR" },
        { property: "required-title", kind: "SCALAR" },
      ]);
    });

    it("returns the expected fields (they are enums)", async () => {
      const mockedGraphQLResponse = {
        IntrospectionOnType: {
          fields: [
            {
              name: "type",
              type: {
                name: "String",
                kind: "ENUM",
              },
            },
          ],
        },
      };
      graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

      const validProperties = await getValidPropertiesForObject("Brand");

      expect(validProperties).toEqual([{ property: "type", kind: "ENUM" }]);
    });

    it("uses the IntrospectionOnInputType response when it populated (InputTypes are more accurate)", async () => {
      const mockedGraphQLResponse = {
        IntrospectionOnType: {
          fields: [
            {
              name: "non-enum-type-used-for-read",
              type: {
                name: "String",
                kind: "SCALAR",
              },
            },
          ],
        },
        IntrospectionOnInputType: {
          inputFields: [
            {
              name: "enum-type-used-for-input-only",
              type: {
                name: "String",
                kind: "ENUM",
              },
            },
          ],
        },
      };
      graphQlRequest.mockResolvedValueOnce(mockedGraphQLResponse);

      const validProperties = await getValidPropertiesForObject("Brand");

      expect(validProperties).toEqual([
        { property: "enum-type-used-for-input-only", kind: "ENUM" },
      ]);
    });

    it("does not return any fields with kind OBJECT", async () => {
      const mockedGraphQLResponse = {
        IntrospectionOnType: {
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
      const mockedGraphQLResponse = {
        response: {
          data: {
            "brand-1": null,
          },
        },
      };
      graphQlRequest.mockRejectedValueOnce(mockedGraphQLResponse);

      await getExistingObjects("Brand", [{ externalId: "brand-1" }]);

      expect(graphQlRequest).toBeCalledWith(
        'query getBrands { brand-1: getBrand (external_id: "brand-1", ignore_availability: true) { __typename uid slug external_id } }',
        {}
      );
    });

    it("returns all given uids when the request does not error", async () => {
      const mockedGraphQLResponse = {
        response: {
          data: {
            "brand-1": {
              external_id: "brand-1-ext-id",
              uid: "123",
              __typename: "Brand",
            },
            "brand-2": {
              external_id: "brand-2-ext-id",
            },
            "brand-3": {
              external_id: "brand-3-ext-id",
            },
          },
        },
      };
      graphQlRequest.mockRejectedValueOnce(mockedGraphQLResponse);

      const got = await getExistingObjects("Brand", [
        { externalId: "brand-1" },
        { externalId: "brand-2" },
        { externalId: "brand-3" },
      ]);
      expect(got.existingExternalIds).toEqual(
        new Set(["brand-1", "brand-2", "brand-3"])
      );
      expect(got.missingExternalIds).toEqual(new Set([]));
    });

    it("returns the uids that exist when some queries return a null value", async () => {
      const mockedGraphQLResponse = {
        response: {
          data: {
            "brand-1": null,
            "brand-2": {
              external_id: "brand-2-ext-id",
            },
            "brand-3": {
              external_id: "brand-3-ext-id",
            },
          },
        },
      };
      graphQlRequest.mockRejectedValueOnce(mockedGraphQLResponse);

      const got = await getExistingObjects("Brand", [
        { externalId: "brand-1" },
        { externalId: "brand-2" },
        { externalId: "brand-3" },
      ]);
      expect(got.existingExternalIds).toEqual(new Set(["brand-2", "brand-3"]));
      expect(got.missingExternalIds).toEqual(new Set(["brand-1"]));
    });

    it("rejects when an unexpected error occurs", async () => {
      graphQlRequest.mockRejectedValueOnce(new Error("Unexpected error"));
      await expect(
        getExistingObjects("Brand", [
          { externalId: "brand-1" },
          { externalId: "brand-2" },
          { externalId: "brand-3" },
        ])
      ).rejects.toThrow("Unexpected error");
    });
  });
});
