/**
 * @jest-environment node
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMocks, RequestMethod } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from "jest-fetch-mock";
import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";
import fetchPlaybackUrl from "../../pages/api/playback/[assetId]";

jest.mock("@aws-amplify/core");
jest.mock("@aws-amplify/auth");

// Add field that exists on node-mocks-http
// https://www.paigeniedringhaus.com/blog/how-to-unit-test-next-js-api-routes-with-typescript
interface MockedApiResponse extends NextApiResponse {
  _getJSONData: () => string;
}

describe("/api/gateways/[gatewayUID] API Endpoint", () => {
  function mockRequestResponse(method: RequestMethod = "GET") {
    const assetId = 123;
    const { req, res }: { req: NextApiRequest; res: MockedApiResponse } =
      createMocks({ method });
    req.headers = {
      "Content-Type": "application/json",
    };
    req.query = { assetId: `${assetId}` };
    return { req, res };
  }

  beforeEach(() => {
    process.env.COGNITO_AWS_REGION = "eu-west-1";
    process.env.COGNITO_IDENTITY_POOL_ID = "identity-pool";
    process.env.COGNITO_USER_POOL_ID = "user-pool";
    process.env.COGNITO_CLIENT_ID = "client-id";
    process.env.COGNITO_EMAIL = "email";
    process.env.COGNITO_PASSWORD = "password";
    process.env.NEXT_PUBLIC_SKYLARK_API_URL = "http://skylark.com";
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  describe("AWS amplify", () => {
    it("configures amplify with the correct config", async () => {
      // Arrange
      const mockConfigure = Amplify.configure as jest.Mock;

      // Act.
      const { req, res } = mockRequestResponse();
      fetchMock.mockOnce(JSON.stringify({ test: "data" }));
      await fetchPlaybackUrl(req, res);

      // Assert.
      expect(mockConfigure).toHaveBeenCalledWith({
        Auth: {
          authenticationFlowType: "USER_SRP_AUTH",
          region: "eu-west-1",
          userPoolId: "user-pool",
          userPoolWebClientId: "client-id",
        },
      });
    });

    it("Sign in is called with email and password from environment", async () => {
      // Arrange.
      const mockSignIn = Auth.signIn as jest.Mock;

      // Act.
      const { req, res } = mockRequestResponse();
      fetchMock.mockOnce(JSON.stringify({ test: "data" }));
      await fetchPlaybackUrl(req, res);

      // Assert.
      expect(mockSignIn).toHaveBeenCalledWith("email", "password");
    });

    it("gets the JWT token from currentSession", async () => {
      // Arrange.
      Auth.currentSession = jest.fn().mockResolvedValue({
        getIdToken: jest.fn().mockReturnValue({
          getJwtToken: jest.fn().mockReturnValue("my-token"),
        }),
      });

      // Act.
      const { req, res } = mockRequestResponse();
      fetchMock.mockOnce(JSON.stringify({ test: "data" }));
      await fetchPlaybackUrl(req, res);

      // Assert.
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Authorization: "Bearer my-token",
          },
        })
      );
    });
  });

  describe("HTTP responses", () => {
    it("should return 200 successful response", async () => {
      // Act.
      const { req, res } = mockRequestResponse();
      fetchMock.mockOnce(
        JSON.stringify({ objects: [{ mux: { tokenised_url: "data" } }] })
      );
      await fetchPlaybackUrl(req, res);

      // Assert.
      expect(res.statusCode).toBe(200);
      // eslint-disable-next-line no-underscore-dangle
      expect(res._getJSONData()).toEqual({ playback_url: "data" });
      expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
      expect(res.statusMessage).toEqual("OK");
    });

    it("returns 500 error with message when amplify configure fails with message", async () => {
      // Arrange
      const mockSignIn = Auth.signIn as jest.Mock;
      mockSignIn.mockRejectedValueOnce(new TypeError("error message"));

      // Act.
      const { req, res } = mockRequestResponse();
      await fetchPlaybackUrl(req, res);

      // Assert.
      expect(res.statusCode).toBe(500);
      // eslint-disable-next-line no-underscore-dangle
      expect(res._getJSONData()).toEqual({
        error: "error message",
      });
    });

    it("returns 500 error with generic message when the error has no message", async () => {
      // Arrange
      const mockSignIn = Auth.signIn as jest.Mock;
      mockSignIn.mockRejectedValueOnce("error message");

      // Act.
      const { req, res } = mockRequestResponse();
      await fetchPlaybackUrl(req, res);

      // Assert.
      expect(res.statusCode).toBe(500);
      // eslint-disable-next-line no-underscore-dangle
      expect(res._getJSONData()).toEqual({
        error: "error message",
      });
    });

    it("should return a 500 if there's an error", async () => {
      // Act.
      const { req, res } = mockRequestResponse();
      fetchMock.mockOnce(JSON.stringify({ error: "error" }));
      await fetchPlaybackUrl(req, res);

      // Assert.
      expect(res.statusCode).toBe(500);
      // eslint-disable-next-line no-underscore-dangle
      expect(res._getJSONData()).toEqual("error");
    });

    it("should return a 400 if Asset ID is missing", async () => {
      // Act.
      const { req, res } = mockRequestResponse();
      req.query = {};
      await fetchPlaybackUrl(req, res);

      // Assert.
      expect(res.statusCode).toBe(400);
      // eslint-disable-next-line no-underscore-dangle
      expect(res._getJSONData()).toEqual({
        error: "Invalid asset ID parameter",
      });
    });

    it("should return a 405 if HTTP method is not GET", async () => {
      // Act.
      const { req, res } = mockRequestResponse("POST");
      fetchMock.mockOnce(JSON.stringify({ assetId: "test" }));
      await fetchPlaybackUrl(req, res);

      // Assert.
      expect(res.statusCode).toBe(405);
      expect(req.method).toEqual("POST");
      // eslint-disable-next-line no-underscore-dangle
      expect(res._getJSONData()).toEqual({ error: "Method not allowed" });
    });

    it("should return a 404 if response data is empty", async () => {
      // Act.
      const { req, res } = mockRequestResponse();
      fetchMock.mockOnce(JSON.stringify({}));
      await fetchPlaybackUrl(req, res);

      // Assert.
      expect(res.statusCode).toBe(404);
      // eslint-disable-next-line no-underscore-dangle
      expect(res._getJSONData()).toEqual({
        error: "Playback URL not found in Skylark",
      });
    });

    it("should return a 404 if objects is empty", async () => {
      // Act.
      const { req, res } = mockRequestResponse();
      fetchMock.mockOnce(JSON.stringify({ objects: [] }));
      await fetchPlaybackUrl(req, res);

      // Assert.
      expect(res.statusCode).toBe(404);
      // eslint-disable-next-line no-underscore-dangle
      expect(res._getJSONData()).toEqual({
        error: "Playback URL not found in Skylark",
      });
    });

    it("should return a 404 if the first object doesn't have tokenised_url", async () => {
      // Act.
      const { req, res } = mockRequestResponse();
      fetchMock.mockOnce(JSON.stringify({ objects: [{ mux: {} }] }));
      await fetchPlaybackUrl(req, res);

      // Assert.
      expect(res.statusCode).toBe(404);
      // eslint-disable-next-line no-underscore-dangle
      expect(res._getJSONData()).toEqual({
        error: "Playback URL not found in Skylark",
      });
    });
  });
});
