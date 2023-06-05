module.exports = {
  extends: ["../../.eslintrc.js"],
  ignorePatterns: ["dist"],
  overrides: [
    {
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          {
            devDependencies: false,
            optionalDependencies: false,
            peerDependencies: false,
          },
        ],
      },
    },
  ],
};
