import "@skylark-reference-apps/react/styles/globals.css";
import "@fontsource/outfit/200.css";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/700.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import type { AppProps } from "next/app";
import PlausibleProvider from "next-plausible";
import { withPasswordProtect } from "next-password-protect";
import { LOCAL_STORAGE } from "@skylark-reference-apps/lib";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { DimensionsContextProvider } from "@skylark-reference-apps/react";
import { IntercomProvider } from "react-use-intercom";
import { SkylarkTVLayout } from "../components/layout";

function MyApp({ Component, pageProps }: AppProps) {
  const [skylarkApiUrl, setSkylarkApiUrl] = useState(
    process.env.NEXT_PUBLIC_SAAS_API_ENDPOINT,
  );

  useEffect(() => {
    const update = () => {
      const url =
        localStorage.getItem(LOCAL_STORAGE.apikey) &&
        localStorage.getItem(LOCAL_STORAGE.uri);
      setSkylarkApiUrl(url || process.env.NEXT_PUBLIC_SAAS_API_ENDPOINT);
    };
    update();

    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("storage", update);
    };
  }, []);

  const queryClient = new QueryClient();

  return (
    <PlausibleProvider domain={process.env.NEXT_PUBLIC_APP_DOMAIN as string}>
      <QueryClientProvider client={queryClient}>
        <IntercomProvider appId={"t104fsur"} autoBoot>
          <DimensionsContextProvider>
            <SkylarkTVLayout skylarkApiUrl={skylarkApiUrl}>
              <Component {...pageProps} />
            </SkylarkTVLayout>
          </DimensionsContextProvider>
        </IntercomProvider>
      </QueryClientProvider>
    </PlausibleProvider>
  );
}

export default process.env.NEXT_PUBLIC_PASSWORD_PROTECT
  ? withPasswordProtect(MyApp)
  : MyApp;
