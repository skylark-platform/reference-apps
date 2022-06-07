import type { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    email: process.env.COGNITO_EMAIL as string,
    password: process.env.COGNITO_PASSWORD as string,
    region: process.env.COGNITO_AWS_REGION as string,
    identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID as string,
    userPoolId: process.env.COGNITO_USER_POOL_ID as string,
    userPoolWebClientId: process.env.COGNITO_CLIENT_ID as string,
  })
}
