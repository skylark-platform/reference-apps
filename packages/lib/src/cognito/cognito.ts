import { AuthOptions } from "@aws-amplify/auth/lib-esm/types";

interface IAmplifyParams {
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
  identityPoolId: string;
  storageBucket: string;
}

interface IAmplifyStorage {
  AWSS3: {
    bucket: string;
    // region: string;
  };
}

export interface IAmplifyConfig extends AuthOptions {
  Auth: {
    region: string;
    userPoolId: string;
    userPoolWebClientId: string;
    identityPoolId: string;
    authenticationFlowType: string;
  };
  Storage: IAmplifyStorage;
}

export const amplifyConfig = ({
  region,
  userPoolId,
  userPoolWebClientId,
  identityPoolId,
  storageBucket: bucket,
}: IAmplifyParams) => {
  if (!region || !userPoolId || !userPoolWebClientId || !identityPoolId || !bucket) {
    throw new Error("Invalid Amplify config supplied");
  }

  const config: IAmplifyConfig = {
    Auth: {
      region,
      userPoolId,
      userPoolWebClientId,
      identityPoolId,
      authenticationFlowType: "USER_SRP_AUTH",
    },
    Storage: {
      AWSS3: {
        bucket,
        // region,
      },
    },
  };

  return config;
};
