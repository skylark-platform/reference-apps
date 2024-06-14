module.exports = {
  extends: ["../../.eslintrc.js"],
  ignorePatterns: ["dist", "tools/airtableScripts"],
  overrides: [
    {
      files: ["**/*.ts"],
      rules: {
        "@typescript-eslint/no-throw-literal": "off",
      },
    },
  ],
};
