import type { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  // eslint-disable-next-line prefer-destructuring
  const jwtest = process.env.jwtest;
  res.status(200).json(jwtest)
}
