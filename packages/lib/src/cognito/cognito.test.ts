import { amplifyConfig, IAmplifyConfig } from ".";

describe("cognito", () => {
  describe("amplifyConfig", () => {
    afterEach(() => {
      process.env.NEXT_PUBLIC_COGNITO_AWS_REGION = "";
      process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID = "";
      process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID = "";
      process.env.NEXT_PUBLIC_COGNITO_COOKIE_DOMAIN = "";
      process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID = "";
      process.env.NEXT_PUBLIC_AMPLIFY_STORAGE_BUCKET = "";
    });

    it("returns config when the credentials are passed into the function", () => {
      const config = amplifyConfig({
        region: "eu-west-1",
        userPoolId: "123123",
        userPoolWebClientId: "123",
        identityPoolId: "111",
      });

      const expectedConfig: IAmplifyConfig = {
        Auth: {
          region: "eu-west-1",
          userPoolId: "123123",
          userPoolWebClientId: "123",
          identityPoolId: "111",
          authenticationFlowType: "USER_SRP_AUTH",
        },
      };

      expect(config).toEqual(expectedConfig);
    });

    it("throws an error when invalid credentials are given", () => {
      expect(amplifyConfig).toThrowError("Invalid Amplify config supplied");
    });
  });
});
