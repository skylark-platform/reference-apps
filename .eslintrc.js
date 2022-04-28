module.exports = {
  env: {
    node: true,
    browser: true,
    jest: true,
    es6: true,
  },
  plugins: ["prettier", "react", "unused-imports"],
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "plugin:storybook/recommended",
  ],
  settings: {
    react: { version: "detect" },
    jest: { version: "detect" },
  },
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [".storybook/**"],
      },
    ],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": "error",
  },
  ignorePatterns: ["**/.next/**/*"],
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
      excludedFiles: ["**/cypress/**/*"],
      plugins: ["prettier", "jest", "@typescript-eslint", "unused-imports"],
      extends: [
        "airbnb-typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:eslint-comments/recommended",
        "plugin:jest/recommended",
        "prettier",
      ],
      rules: {
        "@typescript-eslint/unbound-method": "off",
        "no-void": ["error", { allowAsStatement: true }],
        "react/jsx-no-literals": ["error"],
        "react/jsx-props-no-spreading": "off",
        "react/jsx-sort-props": [
          "error",
          {
            ignoreCase: false,
            callbacksLast: true,
          },
        ],
        "react/prop-types": "off",
        "import/prefer-default-export": "off",
        "import/no-extraneous-dependencies": [
          "error",
          {
            devDependencies: ["**/*.stories.tsx", "**/*.test.tsx"],
          },
        ],
        "require-await": "error",
      },
    },
  ],
};
