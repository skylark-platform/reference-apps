import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import tsPlugin from "@typescript-eslint/eslint-plugin";

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
  ...compat.extends("plugin:@next/next/recommended").map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),
  {
    files: ["**/*.ts", "**/*.tsx"],

    // languageOptions: {
    //   parser: tsParser,
    //   ecmaVersion: 2018,
    //   sourceType: "module",

    //   parserOptions: {
    //     ecmaFeatures: {
    //       jsx: true,
    //     },

    //     project: ["./tsconfig.json"],
    //     tsconfigRootDir: __dirname,
    //   },
    // },

    // plugins: {
    //   "@typescript-eslint": tsPlugin,
    // },

    rules: {
      "react/react-in-jsx-scope": "off",
      "no-underscore-dangle": "off",
    },
  },
];
