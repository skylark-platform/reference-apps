import {
  SKYLARK_API,
  amplifyConfig,
  ApiViewingsObjects,
  ApiViewingsError,
} from "@skylark-reference-apps/lib";
import { NextApiRequest, NextApiResponse } from "next";
import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";

const config = amplifyConfig();
Amplify.configure(config);

const fetchPlaybackUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const { assetId } = req.query;
  const email = process.env.COGNITO_EMAIL as string;
  const password = process.env.COGNITO_PASSWORD as string;

  // check email and password are popluated. Return 400 with message either email or password is empty
  let token;
  try {
    await Auth.signIn(email, password);
    const session = await Auth.currentSession();
    token = session.getIdToken().getJwtToken();
  } catch (e) {
    // return error 500
    return res.status(500).json(e);
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
