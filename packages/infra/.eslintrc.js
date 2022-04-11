module.exports = {
  extends: ["../../.eslintrc.js"],
  ignorePatterns: ["dist", "cdk.out"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  env: {
    node: true,
  },
  rules: {
    "no-new": "off",
  },
  overrides: [
    {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      files: ["src/**/*.ts", "src/**/*.tsx"],
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    },
  ],
};
