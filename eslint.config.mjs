import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import jest from "eslint-plugin-jest";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  { ignores: ["**/.next/**/*", "**/storybook-static/**/*"] },
);

// export default [
//   {
//     ignores: ["**/.next/**/*", "**/storybook-static/**/*"],
//   },
//   ...compat.extends(
//     "airbnb-base",
//     "eslint:recommended",
//     "plugin:react/recommended",
//     "prettier",
//     "plugin:storybook/recommended",
//   ),
//   {
//     plugins: {
//       prettier,
//       react,
//       "unused-imports": unusedImports,
//     },

//     languageOptions: {
//       globals: {
//         ...globals.node,
//         ...globals.browser,
//         ...globals.jest,
//       },
//     },

//     settings: {
//       react: {
//         version: "detect",
//       },

//       jest: {
//         version: "detect",
//       },
//     },

//     rules: {
//       "import/no-extraneous-dependencies": [
//         "error",
//         {
//           devDependencies: [".storybook/**"],
//         },
//       ],

//       "unused-imports/no-unused-imports": "error",
//       "unused-imports/no-unused-vars": "error",
//     },
//   },
//   ...compat
//     .extends(
//       "airbnb-typescript",
//       "plugin:@typescript-eslint/recommended",
//       "plugin:@typescript-eslint/recommended-requiring-type-checking",
//       "plugin:eslint-comments/recommended",
//       "plugin:jest/recommended",
//       "prettier",
//     )
//     .map((config) => ({
//       ...config,
//       files: ["**/*.ts", "**/*.tsx"],
//       ignores: ["**/cypress/**/*"],
//       languageOptions: {
//         sourceType: "module",
//         parserOptions: {
//           project: ["./tsconfig.json"],
//           tsconfigRootDir: __dirname,
//         },
//       },
//     })),
//   //   {
//   //     files: ["**/*.ts", "**/*.tsx"],
//   //     ignores: ["**/cypress/**/*"],

//   //     languageOptions: {
//   //       parser: tsParser,
//   //       ecmaVersion: 2018,
//   //       sourceType: "module",

//   //       parserOptions: {
//   //         ecmaFeatures: {
//   //           jsx: true,
//   //         },

//   //         project: ["./tsconfig.json"],
//   //         tsconfigRootDir: __dirname,
//   //       },
//   //     },

//   //     plugins: {
//   //       prettier,
//   //       jest,
//   //       "@typescript-eslint": typescriptEslint,
//   //       "unused-imports": unusedImports,
//   //     },

//   //     rules: {
//   //       "@typescript-eslint/unbound-method": "off",

//   //       "no-void": [
//   //         "error",
//   //         {
//   //           allowAsStatement: true,
//   //         },
//   //       ],

//   //       "react/jsx-no-literals": ["error"],
//   //       "react/jsx-props-no-spreading": "off",

//   //       "react/jsx-sort-props": [
//   //         "error",
//   //         {
//   //           ignoreCase: false,
//   //           callbacksLast: true,
//   //         },
//   //       ],

//   //       "react/prop-types": "off",
//   //       "import/prefer-default-export": "off",

//   //       "import/no-extraneous-dependencies": [
//   //         "error",
//   //         {
//   //           devDependencies: ["**/*.stories.tsx", "**/*.test.tsx"],
//   //         },
//   //       ],

//   //       "require-await": "error",
//   //     },
//   //   },
// ];
