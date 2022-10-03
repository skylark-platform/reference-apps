import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    "https://snjp62qr4fbvzfpf6xwlnpit54.appsync-api.eu-west-1.amazonaws.com/graphql":
      {
        headers: {
          "x-api-key": "da2-ql6uljkn4vabjblyq4ty2sijhu",
        },
      },
  },
  documents: [
    "components/**/*.tsx",
    "pages/**/*.tsx",
    "hooks/**/*.tsx",
    "!/gql/**/*",
  ],
  generates: {
    "./types/gql.ts": {
      // preset: 'client',
      plugins: [
        "typescript",
        {
          add: {
            content:
              "/* eslint-disable eslint-comments/no-unlimited-disable */",
          },
        },
        {
          add: {
            content: "/* eslint-disable */",
          },
        },
        {
          add: {
            content: "/* eslint-enable */",
            placement: "append",
          },
        },
      ],
    },
  },
};

export default config;
