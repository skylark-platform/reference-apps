/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "@skylark-reference-apps/lib",
  "@skylark-reference-apps/react",
]);
const nextTranslate = require("next-translate");
const { withPlausibleProxy } = require("next-plausible");

const moduleExports = {
  reactStrictMode: true,
};

module.exports = nextTranslate(withTM(withPlausibleProxy(moduleExports)));
