import Auth from "@aws-amplify/auth";
import { ApiBatchResponse } from "@skylark-reference-apps/lib";
import axios from "axios";
import { authenticatedSkylarkRequest, batchSkylarkRequest } from "./api";

jest.mock("axios");
jest.mock("@aws-amplify/auth");
jest.mock("@skylark-reference-apps/lib", () => ({
  SKYLARK_API: "https://skylarkplatform.io",
}));

describe("skylark.api", () => {
  let axiosRequest: jest.Mock;

  beforeEach(() => {
    axiosRequest = axios.request as jest.Mock;
    Auth.currentSession = jest.fn().mockResolvedValue({
      getIdToken: jest.fn().mockReturnValue({
        getJwtToken: jest.fn().mockReturnValue("token"),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticatedSkylarkRequest", () => {
    it("calls axios.request", async () => {
      await authenticatedSkylarkRequest("/api/episodes");

      expect(axiosRequest).toBeCalled();
    });

    it("calls axios.request with default config when no config is given", async () => {
      await authenticatedSkylarkRequest("/api/episodes");

      expect(axiosRequest).toBeCalledWith({
        headers: {
          Authorization: "Bearer token",
          "Cache-Control": "no-cache",
        },
        url: "https://skylarkplatform.io/api/episodes",
      });
    });

    it("calls axios.request with custom config when it is given", async () => {
      const data = {
        title: "title",
        slug: "slug",
      };
      await authenticatedSkylarkRequest("/api/episodes", {
        method: "PUT",
        data,
      });

      expect(axiosRequest).toBeCalledWith({
        headers: {
          Authorization: "Bearer token",
          "Cache-Control": "no-cache",
        },
        url: "https://skylarkplatform.io/api/episodes",
        method: "PUT",
        data,
      });
    });
  });

  describe("batchSkylarkRequest", () => {
    it("calls axios.request with a Skylark batch request", async () => {
      // Arrange.
      const data: ApiBatchResponse[] = [
        {
          code: 200,
          id: "request-id",
          header: {},
          body: JSON.stringify({}),
        },
      ];
      axiosRequest.mockImplementation(() => ({ data }));

      // Act.
      await batchSkylarkRequest([
        { id: "batch-1", url: "/api/episode", method: "PUT", data: "data" },
      ]);

      // Assert.
      expect(axiosRequest).toBeCalledWith({
        headers: {
          Authorization: "Bearer token",
          "Cache-Control": "no-cache",
        },
        url: "https://skylarkplatform.io/api/batch/",
        method: "POST",
        data: [
          { id: "batch-1", url: "/api/episode", method: "PUT", data: "data" },
        ],
      });
    });

    it("throws an error if one of the batch requests fails", async () => {
      // Arrange.
      const data: ApiBatchResponse[] = [
        {
          code: 500,
          id: "request-id",
          header: {},
          body: JSON.stringify({}),
        },
      ];
      axiosRequest.mockImplementation(() => ({ data }));

      // Act.
      await expect(
        batchSkylarkRequest([
          { id: "batch-1", url: "/api/episode", method: "PUT", data: "data" },
        ])
      ).rejects.toThrow(
        `Batch request "request-id" failed with 500. Response body: {}`
      );
    });
  });
});
