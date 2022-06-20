import { amplifyConfig, IAmplifyConfig } from ".";

describe("cognito", () => {
  describe("amplifyConfig", () => {
    it("returns config when the credentials are passed into the function", () => {
      const config = amplifyConfig({
        region: "eu-west-1",
        userPoolId: "123123",
        userPoolWebClientId: "123",
      });

      const expectedConfig: IAmplifyConfig = {
        Auth: {
          region: "eu-west-1",
          userPoolId: "123123",
          userPoolWebClientId: "123",
          authenticationFlowType: "USER_SRP_AUTH",
        },
      };

      expect(config).toEqual(expectedConfig);
    });

    it("throws an error when invalid credentials are given", () => {
      const func = () =>
        amplifyConfig({
          region: "",
          userPoolId: "",
          userPoolWebClientId: "",
        });
      expect(func).toThrowError("Invalid Amplify config supplied");
    });
  });
});
