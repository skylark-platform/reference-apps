import "../styles/globals.css";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/700.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import type { AppProps } from "next/app";
import PlausibleProvider from "next-plausible";
import { withPasswordProtect } from "next-password-protect";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { IntercomProvider } from "react-use-intercom";
import { SkylarkTVLayout } from "../components/layout";
import { DimensionsContextProvider } from "../contexts";
import { CLIENT_APP_CONFIG, LOCAL_STORAGE } from "../constants/app";

const IntercomWrapper = ({ children }: { children: ReactNode }) =>
  CLIENT_APP_CONFIG.withIntercom ? (
    <IntercomProvider appId={"t104fsur"} autoBoot>
      {children}
    </IntercomProvider>
  ) : (
    children
  );

function MyApp({ Component, pageProps }: AppProps) {
  const [skylarkApiUrl, setSkylarkApiUrl] = useState(
    process.env.NEXT_PUBLIC_SAAS_API_ENDPOINT,
  );

  useEffect(() => {
    const update = () => {
      const url =
        window.localStorage.getItem(LOCAL_STORAGE.apikey) &&
        window.localStorage.getItem(LOCAL_STORAGE.uri);
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
        <IntercomWrapper>
          <DimensionsContextProvider>
            <SkylarkTVLayout skylarkApiUrl={skylarkApiUrl}>
              <Component {...pageProps} />
            </SkylarkTVLayout>
          </DimensionsContextProvider>
        </IntercomWrapper>
      </QueryClientProvider>
    </PlausibleProvider>
  );
}

export default process.env.NEXT_PUBLIC_PASSWORD_PROTECT
  ? withPasswordProtect(MyApp)
  : MyApp;
