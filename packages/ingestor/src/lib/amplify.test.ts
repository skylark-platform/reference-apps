import { Auth } from "@aws-amplify/auth";
import { getToken, signInToCognito } from "./amplify";

// TODO remove if can: https://github.com/cloudflare/miniflare/issues/271
jest.mock('uuid', () => 'eb7b7961-395d-4b4c-afc6-9ebcadaf0150');

jest.mock("./constants", () => ({
  COGNITO_EMAIL: "email",
  COGNITO_PASSWORD: "password",
}));
jest.mock("@aws-amplify/auth");

describe("cognito", () => {
  let signIn: jest.Mock;

  beforeEach(() => {
    signIn = Auth.signIn as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signInToCognito", () => {
    it("calls Auth.signIn using the username and password from the environment", async () => {
      await signInToCognito();

      expect(signIn).toBeCalledWith("email", "password");
    });

    it("throws when Auth.signIn throws", async () => {
      // eslint-disable-next-line @typescript-eslint/require-await,require-await
      signIn.mockImplementation(async () => {
        throw new Error("rejected");
      });

      await expect(signInToCognito()).rejects.toThrow("rejected");
    });
  });

  describe("getToken", () => {
    it("returns the token", async () => {
      Auth.currentSession = jest.fn().mockResolvedValue({
        getIdToken: jest.fn().mockReturnValue({
          getJwtToken: jest.fn().mockReturnValue("token"),
        }),
      });

      const token = await getToken();
      expect(token).toEqual("token");
    });

    it("throws when Auth.signIn throws", async () => {
      // eslint-disable-next-line @typescript-eslint/require-await,require-await
      Auth.currentSession = jest.fn().mockImplementation(async () => {
        throw new Error("rejected");
      });

      await expect(getToken()).rejects.toThrow("rejected");
    });
  });
});
