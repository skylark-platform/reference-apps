import type { CodegenConfig } from "@graphql-codegen/cli";
import { SAAS_API_ENDPOINT, SAAS_API_KEY } from "./src/constants/env";
import { CLIENT_APP_CONFIG } from "./src/constants/app";

const onlyGenerateCssFile = process.env.ONLY_GENERATE_CSS_FILE === "true";

if (onlyGenerateCssFile) {
  // eslint-disable-next-line no-console
  console.log("[Codegen] Only generating globals.css");
} else {
  // eslint-disable-next-line no-console
  console.log(`[Codegen] URL: ${SAAS_API_ENDPOINT}`);
}

const { primary, accent } = CLIENT_APP_CONFIG.colours;

const gqlFile = "./src/types/gql.ts";
const globalCSSFile = "./src/styles/globals.css";

const gqlGenerator: CodegenConfig["generates"][0] = {
  plugins: [
    "typescript",
    {
      add: {
        content:
          "/* auto-generated by graphql-codegen */\n/* eslint-disable eslint-comments/no-unlimited-disable */\n/* eslint-disable */",
      },
    },
    {
      add: {
        content: "/* eslint-enable */",
        placement: "append",
      },
    },
  ],
};

const cssGenerator: CodegenConfig["generates"][0] = {
  plugins: [
    {
      add: {
        content:
          "/* auto-generated by graphql-codegen */\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
      },
    },
    {
      add: {
        content: `:root {
--skylarktv-primary-color: ${primary.startsWith("#") ? primary : `#${primary}`};
--skylarktv-accent-color: ${accent.startsWith("#") ? accent : `#${accent}`};
}`,
      },
    },
  ],
};

const generates: CodegenConfig["generates"] = onlyGenerateCssFile
  ? { [globalCSSFile]: cssGenerator }
  : { [gqlFile]: gqlGenerator, [globalCSSFile]: cssGenerator };

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
  generates,
  hooks: { afterAllFileWrite: ["prettier --write"] },
};

export default config;
