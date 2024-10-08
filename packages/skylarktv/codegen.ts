import type { CodegenConfig } from "@graphql-codegen/cli";
import { SAAS_API_ENDPOINT, SAAS_API_KEY } from "./src/lib/skylark";

// eslint-disable-next-line no-console
console.log(`[Codegen] URL: ${SAAS_API_ENDPOINT}`);

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [SAAS_API_ENDPOINT]: {
      headers: {
        "x-api-key": SAAS_API_KEY,
        Authorization: SAAS_API_KEY,
      },
    },
  },
  generates: {
    "./src/types/gql.ts": {
      plugins: [
        "typescript",
        {
          add: {
            content: `/* auto-generated by graphql-codegen */`,
          },
        },
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
  hooks: { afterAllFileWrite: ["prettier --write"] },
};

export default config;
