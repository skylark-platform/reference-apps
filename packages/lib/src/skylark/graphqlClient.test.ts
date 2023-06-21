// eslint-disable-next-line import/no-extraneous-dependencies
import "regenerator-runtime/runtime";
import { GraphQLClient } from "graphql-request";
import { graphQLClient } from "./graphqlClient";

jest.mock("./skylark.constants", () => ({
  SAAS_API_ENDPOINT: "https://endpoint/graphql",
  SAAS_API_KEY: "api-key",
}));

describe("graphQLClient", () => {
  it("instantiates a new GraphQLClient", () => {
    const client = new GraphQLClient("https://endpoint/graphql", {
      headers: {
        Authorization: "api-key",
      },
    });
    expect(graphQLClient).toEqual(client);
  });
});
