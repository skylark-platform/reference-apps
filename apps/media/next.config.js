/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "@skylark-reference-apps/lib",
  "@skylark-reference-apps/react",
]);

const moduleExports = {
  reactStrictMode: true,
  env: {
    // Next.js will replace process.env.COGNITO_EMAIL at build time.
    // So long as we don't use these clientside then they will be hidden
    // This isn't great but serverless-nextjs doesn't have amazing support for env variables
    // https://github.com/serverless-nextjs/serverless-next.js/issues/184
    // https://nextjs.org/docs/api-reference/next.config.js/environment-variables
    COGNITO_EMAIL: process.env.COGNITO_EMAIL,
    COGNITO_PASSWORD: process.env.COGNITO_USERNAME,
    COGNITO_AWS_REGION: process.env.COGNITO_AWS_REGION,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    COGNITO_IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID
  },
};

// Ensure that your source maps include changes from all other Webpack plugins
module.exports = withTM(moduleExports);
