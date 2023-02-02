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
import { withPasswordProtect } from "next-password-protect";
import createDefaultSeo from "../next-seo.config";

const appTitle = process.env.NEXT_PUBLIC_APP_TITLE || "StreamTV";
const tvShowsHref =
  process.env.NEXT_PUBLIC_TV_SHOWS_HREF || "/brand/reculg97iNzbkEZCK";

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation("common");

  return (
    <PlausibleProvider domain={process.env.NEXT_PUBLIC_APP_DOMAIN as string}>
      <StreamTVLayout
        appTitle={appTitle}
        skylarkApiUrl={process.env.NEXT_PUBLIC_SAAS_API_ENDPOINT}
        timeTravelEnabled
        tvShowsHref={tvShowsHref}
      >
        <DefaultSeo {...createDefaultSeo(appTitle, t("seo.description"))} />
        <Component {...pageProps} />
      </StreamTVLayout>
    </PlausibleProvider>
  );
}

export default process.env.NEXT_PUBLIC_PASSWORD_PROTECT
  ? withPasswordProtect(MyApp)
  : MyApp;
