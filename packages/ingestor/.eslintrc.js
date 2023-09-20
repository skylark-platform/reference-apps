module.exports = {
  extends: ["../../.eslintrc.js"],
  ignorePatterns: ["dist"],
  overrides: [
    {
      files: ["**/*.ts"],
      rules: {
        "@typescript-eslint/no-throw-literal": "off",
      },
    },
  ],
};
