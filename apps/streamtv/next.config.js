/** @type {import('next').NextConfig} */

// const withTM = require("next-transpile-modules")([
//   "@skylark-reference-apps/lib",
//   "@skylark-reference-apps/react",
// ]);
// eslint-disable-next-line import/no-extraneous-dependencies
const nextTranslate = require("next-translate-plugin");
const { withPlausibleProxy } = require("next-plausible");

const moduleExports = withPlausibleProxy()({
  reactStrictMode: true,
  transpilePackages: [
    "@skylark-reference-apps/lib",
    "@skylark-reference-apps/react",
  ],
});

module.exports = nextTranslate(moduleExports);
