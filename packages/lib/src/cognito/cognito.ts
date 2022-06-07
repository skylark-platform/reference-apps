import { AuthOptions } from "@aws-amplify/auth/lib-esm/types";

interface IAmplifyParams {
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
  identityPoolId: string;
}

export interface IAmplifyConfig extends AuthOptions {
  Auth: {
    region: string;
    userPoolId: string;
    userPoolWebClientId: string;
    authenticationFlowType: string;
    identityPoolId: string;
  };
}

export const amplifyConfig = ({
  region,
  userPoolId,
  userPoolWebClientId,
  identityPoolId,
}: IAmplifyParams) => {
  if (!region || !userPoolId || !userPoolWebClientId) {
    throw new Error("Invalid Amplify config supplied");
  }

  const config: IAmplifyConfig = {
    Auth: {
      region,
      userPoolId,
      userPoolWebClientId,
      authenticationFlowType: "USER_SRP_AUTH",
      identityPoolId,
    },
  };

  return config;
};
