import "../styles/globals.css";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import { DimensionsContextProvider } from "@skylark-reference-apps/react";
import I18nProvider from "next-translate/I18nProvider";
import common from "@skylark-reference-apps/streamtv/locales/en-gb/common.json";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: "fullscreen",
};

export const decorators = [
  (Story) => (
    <I18nProvider lang="en-gb" namespaces={{ common }}>
      <DimensionsContextProvider>
        <Story />
      </DimensionsContextProvider>
    </I18nProvider>
  ),
];
