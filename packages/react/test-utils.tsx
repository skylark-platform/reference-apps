// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import I18nProvider from "next-translate/I18nProvider";
import { render, RenderOptions } from "@testing-library/react";

import common from "@skylark-reference-apps/streamtv/locales/en-gb/common.json";

// eslint-disable-next-line react/prop-types
const AllTheProviders: React.JSXElementConstructor<{
  children: React.ReactElement;
}> = ({ children }) => (
  <I18nProvider lang="en-gb" namespaces={{ common }}>
    {children}
  </I18nProvider>
);

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
