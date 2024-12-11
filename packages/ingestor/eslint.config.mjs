import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import base from "../../eslint.config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...base,
  {
    ignores: ["**/dist", "tools/airtableScripts"],
  },
  {
    files: ["**/*.ts"],

    rules: {
      "@typescript-eslint/no-throw-literal": "off",
      "eslint-disable": "off",
    },
  },
];
