import { Auth } from "@aws-amplify/auth";
import { Amplify } from "@aws-amplify/core";
import { S3ProviderPutConfig, Storage } from "@aws-amplify/storage";
import { amplifyConfig } from "@skylark-reference-apps/lib";
import { AMPLIFY_STORAGE_BUCKET, COGNITO_EMAIL, COGNITO_IDENTITY_POOL_ID, COGNITO_PASSWORD, COGNITO_REGION, COGNITO_USER_POOL_CLIENT_ID, COGNITO_USER_POOL_ID } from "./constants";

const defaultStorageConfig = {
  customPrefix: {
    public: "",
    private: "",
    protected: "",
  },
};

const config = amplifyConfig({
  region: COGNITO_REGION,
  userPoolId: COGNITO_USER_POOL_ID,
  userPoolWebClientId: COGNITO_USER_POOL_CLIENT_ID,
  identityPoolId: COGNITO_IDENTITY_POOL_ID,
  storageBucket: AMPLIFY_STORAGE_BUCKET,
});

Amplify.configure(config);

/**
 * signInToCognito - signs into Cognito using the email and password from the environment
 * @returns Promise
 */
export const signInToCognito = () =>
  Auth.signIn(COGNITO_EMAIL, COGNITO_PASSWORD);

/**
 * getToken - returns a Bearer token that is authorized with Skylark
 * @returns Skylark Bearer token
 */
export const getToken = async () => {
  const session = await Auth.currentSession();
  return session.getIdToken().getJwtToken();
};

export const upload = async (key: string, file: object | string, putConfig?: S3ProviderPutConfig) => {
  const session = await Auth.currentSession();
  console.log(session);
  await Storage.put(key, file, {
    ...defaultStorageConfig,
    ...putConfig,
  });
}
