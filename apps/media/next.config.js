/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "@skylark-reference-apps/lib",
  "@skylark-reference-apps/react",
]);

const moduleExports = {
  reactStrictMode: true,
};

module.exports = withTM(moduleExports);
