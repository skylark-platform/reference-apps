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
import PlausibleProvider from "next-plausible";
import createDefaultSeo from "../next-seo.config";

const appTitle = "StreamTV (SLX)";

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation("common");

  return (
    <PlausibleProvider domain={process.env.NEXT_PUBLIC_APP_DOMAIN as string}>
      <StreamTVLayout
        appTitle={appTitle}
        skylarkApiUrl={process.env.NEXT_PUBLIC_SAAS_API_ENDPOINT}
        timeTravelEnabled
        tvShowsHref="/brand/reculg97iNzbkEZCK"
      >
        <DefaultSeo {...createDefaultSeo(appTitle, t("seo.description"))} />
        <Component {...pageProps} />
      </StreamTVLayout>
    </PlausibleProvider>
  );
}

export default MyApp;
