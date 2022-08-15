import { Auth } from "@aws-amplify/auth";
import { Amplify } from "@aws-amplify/core";
import { amplifyConfig } from "@skylark-reference-apps/lib";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  WORKFLOW_SERVICE_WATCH_BUCKET,
  COGNITO_EMAIL,
  COGNITO_IDENTITY_POOL_ID,
  COGNITO_PASSWORD,
  COGNITO_REGION,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
} from "./constants";

/**
 * configureAmplify - configures Amplify
 */
export const configureAmplify = () => {
  const config = amplifyConfig({
    region: COGNITO_REGION,
    userPoolId: COGNITO_USER_POOL_ID,
    userPoolWebClientId: COGNITO_USER_POOL_CLIENT_ID,
    identityPoolId: COGNITO_IDENTITY_POOL_ID,
    storageBucket: WORKFLOW_SERVICE_WATCH_BUCKET,
  });

  Amplify.configure(config);
};

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

export const uploadToWorkflowServiceWatchBucket = async (
  filename: string,
  body: string,
  assetId: string
) => {
  // Get credentials and authenticate with bucket
  // https://github.com/aws-amplify/amplify-js/issues/335#issuecomment-367629338
  const credentials = await Auth.currentCredentials();
  const client = new S3Client({
    region: COGNITO_REGION,
    credentials: Auth.essentialCredentials(credentials),
  });

  const now = new Date();

  const putObjectCommand = new PutObjectCommand({
    Bucket: WORKFLOW_SERVICE_WATCH_BUCKET,
    Key: `${assetId}-${filename}`,
    Body: body,
    Metadata: {
      asset: JSON.stringify({
        uid: assetId,
      }),
      "encoded-original-filename": encodeURIComponent(filename),
      "original-upload-timestamp-iso": now.toISOString(),
      "upload-method": "skylark-ingestor",
    },
  });
  await client.send(putObjectCommand);
};
