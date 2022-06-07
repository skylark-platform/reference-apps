import type { NextApiRequest, NextApiResponse } from 'next'
// eslint-disable-next-line prefer-destructuring
const jwtest = process.env.COGNITO_EMAIL;

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    jwtest: jwtest || "nope",
  })
}
