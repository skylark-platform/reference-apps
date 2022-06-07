/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "@skylark-reference-apps/lib",
  "@skylark-reference-apps/react",
]);

const moduleExports = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    serverRuntimeTest: 'secrettest',
  },
  env: {
    customKey: 'my--test-value',
  },
};

// Ensure that your source maps include changes from all other Webpack plugins
module.exports = withTM(moduleExports);
