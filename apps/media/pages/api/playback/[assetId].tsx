import {
  SKYLARK_API,
  amplifyConfig,
  ApiViewingsResponse,
} from "@skylark-reference-apps/lib";
import { NextApiRequest, NextApiResponse } from "next";
import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";

const fetchPlaybackUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const { assetId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!assetId || typeof assetId !== "string") {
    return res.status(400).json({ error: "Invalid asset ID parameter" });
  }

  const email = process.env.COGNITO_EMAIL as string;
  const password = process.env.COGNITO_PASSWORD as string;

  // check email and password are popluated. Return 500 with message either email or password is empty
  let token;
  try {
    const config = amplifyConfig({
      region: process.env.COGNITO_AWS_REGION as string,
      userPoolId: process.env.COGNITO_USER_POOL_ID as string,
      userPoolWebClientId: process.env.COGNITO_CLIENT_ID as string,
    });
    Amplify.configure(config);
    await Auth.signIn(email, password);
    const session = await Auth.currentSession();
    token = session.getIdToken().getJwtToken();
  } catch (err) {
    if (Object.prototype.hasOwnProperty.call(err, "message")) {
      return res.status(500).json({ error: (err as Error).message });
    }
    return res.status(500).json({ error: err });
  }

  const url = `${SKYLARK_API}/api/viewings/`;
  const body = {
    asset_url: `/api/assets/${assetId}/`,
  };
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as ApiViewingsResponse;
  const { error } = data;

  if (error) {
    return res.status(500).json(error);
  }
  if (
    !data.objects ||
    data.objects.length === 0 ||
    !data.objects[0]?.mux.tokenised_url
  ) {
    return res.status(404).json({ error: "Playback URL not found in Skylark" });
  }
  return res
    .status(200)
    .json({ playback_url: data.objects[0]?.mux.tokenised_url });
};

export default fetchPlaybackUrl;
