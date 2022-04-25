import "@skylark-reference-apps/react/styles/globals.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/700.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import type { AppProps } from "next/app";
import { DimensionSettings } from "@skylark-reference-apps/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Component {...pageProps} />
      <DimensionSettings />
    </div>
  );
}

export default MyApp;
