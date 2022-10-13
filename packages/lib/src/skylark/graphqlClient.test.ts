// eslint-disable-next-line import/no-extraneous-dependencies
import "regenerator-runtime/runtime";
import { GraphQLClient } from "graphql-request";
import { Dimensions } from "../interfaces";
import { graphQLClient, skylarkRequestWithDimensions } from "./graphqlClient";

jest.mock("./skylark.constants", () => ({
  SAAS_ACCOUNT_ID: "account-id",
  SAAS_API_ENDPOINT: "https://endpoint/graphql",
  SAAS_API_KEY: "api-key",
}));

describe("graphQLClient", () => {
  it("instantiates a new GraphQLClient", () => {
    const client = new GraphQLClient("https://endpoint/graphql", {
      headers: {
        "x-account-id": "account-id",
        "x-api-key": "api-key",
      },
    });
    expect(graphQLClient).toEqual(client);
  });

  describe("skylarkRequestWithDimensions", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("makes a request without additional headers when time travel is empty", async () => {
      jest.spyOn(graphQLClient, "request");
      (graphQLClient.request as jest.Mock).mockImplementation(() => {});

      const dimensions: Dimensions = {
        timeTravel: "",
        deviceType: "",
        customerType: "",
        language: "",
      };

      await skylarkRequestWithDimensions("query", dimensions);

      expect(graphQLClient.request).toBeCalledWith("query", {}, {});
    });

    it("makes a request and adds the time travel header when its populated", async () => {
      jest.spyOn(graphQLClient, "request");
      (graphQLClient.request as jest.Mock).mockImplementation(() => {});

      const dimensions: Dimensions = {
        timeTravel: "next week",
        deviceType: "",
        customerType: "",
        language: "",
      };

      await skylarkRequestWithDimensions("query", dimensions);

      expect(graphQLClient.request).toBeCalledWith(
        "query",
        {},
        { "x-time-travel": "next week" }
      );
    });
  });
});
