/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "@skylark-reference-apps/lib",
  "@skylark-reference-apps/react",
]);

const moduleExports = {
  reactStrictMode: true,
};

// Ensure that your source maps include changes from all other Webpack plugins
module.exports = withTM(moduleExports);
