import type { NextApiRequest, NextApiResponse } from 'next'
// eslint-disable-next-line prefer-destructuring
const jwtest = process.env.JWTEST;
// eslint-disable-next-line prefer-destructuring
const serverRuntimeTest = process.env.serverRuntimeTest;
// eslint-disable-next-line prefer-destructuring
const customKey = process.env.customKey;

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    jwtest: jwtest || "nope",
    serverRuntimeTest: serverRuntimeTest || "nope",
    customKey: customKey || "nope"
  })
}
