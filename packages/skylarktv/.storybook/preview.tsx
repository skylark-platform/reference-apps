import "../src/styles/globals.css";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { DimensionsContextProvider } from "../src/contexts/dimensions-context";
import I18nProvider from "next-translate/I18nProvider";
import common from "../locales/en-gb/common.json";
import React from "react";

const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
          <DimensionsContextProvider>
            <Story />
          </DimensionsContextProvider>
        </QueryClientProvider>
      </I18nProvider>
    ),
  ],
};

export default preview;
