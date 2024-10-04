/** @type {import('next').NextConfig} */

// eslint-disable-next-line import/no-extraneous-dependencies
const nextTranslate = require("next-translate-plugin");
const { withPlausibleProxy } = require("next-plausible");

const moduleExports = withPlausibleProxy()({
  reactStrictMode: true,
  transpilePackages: ["@skylark-reference-apps/lib"],
});

module.exports = nextTranslate(moduleExports);
