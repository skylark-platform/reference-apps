import { amplifyConfig, IAmplifyConfig } from ".";

describe("cognito", () => {
  describe("amplifyConfig", () => {
    it("returns config when the credentials are passed into the function", () => {
      const config = amplifyConfig({
        region: "eu-west-1",
        userPoolId: "123123",
        userPoolWebClientId: "123",
        identityPoolId: "identity1",
        storageBucket: "bucket",
      });

      const expectedConfig: IAmplifyConfig = {
        Auth: {
          region: "eu-west-1",
          userPoolId: "123123",
          userPoolWebClientId: "123",
          authenticationFlowType: "USER_SRP_AUTH",
          identityPoolId: "identity1",
        },
        Storage: {
          AWSS3: {
            bucket: "bucket",
          },
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
          identityPoolId: "",
          storageBucket: "",
        });
      expect(func).toThrowError("Invalid Amplify config supplied");
    });

    it("throws an error when a bucket is given with no identity pool", () => {
      const func = () =>
        amplifyConfig({
          region: "reg",
          userPoolId: "use",
          userPoolWebClientId: "use",
          identityPoolId: "",
          storageBucket: "bucket",
        });
      expect(func).toThrowError(
        "Identity Pool ID must be given with Storage Bucket"
      );
    });
  });
});
