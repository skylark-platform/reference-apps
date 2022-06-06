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
        cognitoRegion: "eu-west-1",
        cognitoUserPoolId: "123123",
        cognitoUserPoolWebClientId: "123",
        cognitoIdentityPoolId: "111",
        storageBucket: "amplifyBucket",
      });

      const expectedConfig: IAmplifyConfig = {
        Auth: {
          region: "eu-west-1",
          userPoolId: "123123",
          userPoolWebClientId: "123",
          identityPoolId: "111",
          authenticationFlowType: "USER_SRP_AUTH",
        },
        Storage: {
          AWSS3: {
            bucket: "amplifyBucket",
            region: "eu-west-1",
          },
        },
      };

      expect(config).toEqual(expectedConfig);
    });

    it("returns config when the credentials are passed in through process.env", () => {
      process.env.NEXT_PUBLIC_COGNITO_AWS_REGION = "eu-east-1";
      process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID = "456456";
      process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID = "456";
      process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID = "111";
      process.env.NEXT_PUBLIC_COGNITO_COOKIE_DOMAIN = "localhost";
      process.env.NEXT_PUBLIC_AMPLIFY_STORAGE_BUCKET = "s3Bucket";

      const config = amplifyConfig();

      const expectedConfig: IAmplifyConfig = {
        Auth: {
          region: "eu-east-1",
          userPoolId: "456456",
          userPoolWebClientId: "456",
          authenticationFlowType: "USER_SRP_AUTH",
          identityPoolId: "111",
        },
        Storage: {
          AWSS3: {
            bucket: "s3Bucket",
            region: "eu-east-1",
          },
        },
      };

      expect(config).toEqual(expectedConfig);
    });

    it("throws an error when invalid credentials are given", () => {
      expect(amplifyConfig).toThrowError("Invalid Amplify config supplied");
    });
  });
});
