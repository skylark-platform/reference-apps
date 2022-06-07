import {
  SKYLARK_API,
  amplifyConfig,
  ApiViewingsObjects,
  ApiViewingsError,
} from "@skylark-reference-apps/lib";
import { NextApiRequest, NextApiResponse } from "next";
import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";

const fetchPlaybackUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const { assetId } = req.query;
  const email = process.env.COGNITO_EMAIL as string;
  const password = process.env.COGNITO_PASSWORD as string;

  // check email and password are popluated. Return 500 with message either email or password is empty
  let token;
  try {
    const config = amplifyConfig({
      region: process.env.COGNITO_AWS_REGION as string,
      identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID as string,
      userPoolId: process.env.COGNITO_USER_POOL_ID as string,
      userPoolWebClientId: process.env.COGNITO_CLIENT_ID as string,
    });
    Amplify.configure(config);
    await Auth.signIn(email, password);
    const session = await Auth.currentSession();
    token = session.getIdToken().getJwtToken();
  } catch (err) {
    // return error 500
    console.log("Error getting amplify token", err)
    if (Object.prototype.hasOwnProperty.call(err, "message")) {
      return res.status(500).json({ name: (err as Error)?.name, message: (err as Error).message });
    }
    return res.status(500).json({ name: "Unknown error", message: err });
  }

  const url = `${SKYLARK_API}/api/viewings/`;
  const body = {
    asset_url: `/api/assets/${assetId as string}/`,
  };
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as ApiViewingsObjects | ApiViewingsError;
  const { error } = data as ApiViewingsError;

  if (error) {
    return res.status(500).json(error);
  }
  return res.status(200).json(data);
};

export default fetchPlaybackUrl;
