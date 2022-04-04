import { AuthOptions } from "@aws-amplify/auth/lib-esm/types";
import { ICookieStorageData } from "amazon-cognito-identity-js";

interface IAmplifyParams {
  cognitoRegion: string;
  cognitoUserPoolId: string;
  cognitoUserPoolWebClientId: string;
  cognitoIdentityPoolId: string;
  cookieDomain: string;
  storageBucket: string;
}

interface IAmplifyStorage {
  AWSS3: {
    bucket: string;
    region: string;
  };
}

export interface IAmplifyConfig extends AuthOptions {
  Auth: {
    region: string;
    userPoolId: string;
    userPoolWebClientId: string;
    authenticationFlowType: string;
    identityPoolId: string;
  };
  cookieStorage: ICookieStorageData;
  Storage: IAmplifyStorage;
}

export const amplifyConfig = (amplifyParams?: IAmplifyParams) => {
  // use supplied value first else default to the Next.js env name used in Launcher
  const region =
    amplifyParams?.cognitoRegion ||
    (process.env.NEXT_PUBLIC_COGNITO_AWS_REGION as string);
  const userPoolId =
    amplifyParams?.cognitoUserPoolId ||
    (process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID as string);
  const userPoolWebClientId =
    amplifyParams?.cognitoUserPoolWebClientId ||
    (process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string);
  const identityPoolId =
    amplifyParams?.cognitoIdentityPoolId ||
    (process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID as string);
  const domain =
    amplifyParams?.cookieDomain ||
    (process.env.NEXT_PUBLIC_COGNITO_COOKIE_DOMAIN as string);
  const bucket =
    amplifyParams?.storageBucket ||
    (process.env.NEXT_PUBLIC_AMPLIFY_STORAGE_BUCKET as string);

  if (!region || !userPoolId || !userPoolWebClientId || !domain) {
    throw new Error("Invalid Amplify config supplied");
  }

  const isLocal = ["127.0.0.1", "localhost"].includes(domain);

  const config: IAmplifyConfig = {
    Auth: {
      region,
      userPoolId,
      userPoolWebClientId,
      authenticationFlowType: "USER_SRP_AUTH",
      identityPoolId,
    },
    cookieStorage: {
      domain,
      path: "/",
      expires: 365,
      sameSite: "lax" as const,
      secure: !isLocal,
    },
    Storage: {
      AWSS3: {
        bucket,
        region,
      },
    },
  };

  return config;
};
