import "@skylark-reference-apps/react/styles/globals.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/700.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { StreamTVLayout } from "@skylark-reference-apps/react";
import useTranslation from "next-translate/useTranslation";
import createDefaultSeo from "../next-seo.config";

const appTitle = "StreamTV";

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation("common");

  return (
    <StreamTVLayout appTitle={appTitle} tvShowsHref="/brand/game-of-thrones">
      <DefaultSeo {...createDefaultSeo(appTitle, t("seo.description"))} />
      <Component {...pageProps} />
    </StreamTVLayout>
  );
}

export default MyApp;
