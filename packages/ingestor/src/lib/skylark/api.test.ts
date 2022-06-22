import Auth from "@aws-amplify/auth";
import axios from "axios";
import { authenticatedSkylarkRequest } from "./api";

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
      await authenticatedSkylarkRequest("/api/episodes", { data });

      expect(axiosRequest).toBeCalledWith({
        headers: {
          Authorization: "Bearer token",
          "Cache-Control": "no-cache",
        },
        url: "https://skylarkplatform.io/api/episodes",
        data,
      });
    });
  });
});
