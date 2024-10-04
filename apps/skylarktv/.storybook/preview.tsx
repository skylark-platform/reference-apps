import "../src/styles/globals.css";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import type { Preview } from "@storybook/react";

import { DimensionsContextProvider } from "../src/contexts/dimensions-context";
import I18nProvider from "next-translate/I18nProvider";
import common from "../src/locales/en-gb/common.json";
import React from "react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <I18nProvider lang="en-gb" namespaces={{ common }}>
        <DimensionsContextProvider>
          <Story />
        </DimensionsContextProvider>
      </I18nProvider>
    ),
  ],
};

export default preview;
