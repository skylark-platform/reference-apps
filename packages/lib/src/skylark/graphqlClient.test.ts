import { GraphQLClient } from "graphql-request";
import { graphQLClient } from "./graphqlClient";

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
});
