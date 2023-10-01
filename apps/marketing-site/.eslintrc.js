// {
//   "extends": "next/core-web-vitals",
//   "overrides": [
//     {
//       "files": ["**/*.ts", "**/*.tsx"],
//       "rules": {
//         "no-underscore-dangle": "off"
//       }
//     }
//   ]
// }

module.exports = {
  extends: ["../../.eslintrc.js"],
  overrides: [
    {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
        ecmaVersion: 2018,
        sourceType: "module",
        tsconfigRootDir: __dirname,
      },
      files: ["**/*.ts", "**/*.tsx"],
      extends: ["plugin:@next/next/recommended"],
      rules: {
        "react/react-in-jsx-scope": "off",
        "no-underscore-dangle": "off",
      },
    },
  ],
};
