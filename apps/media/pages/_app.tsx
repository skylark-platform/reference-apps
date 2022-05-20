import "@skylark-reference-apps/react/styles/globals.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/700.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import type { AppProps } from "next/app";
import {
  AppBackgroundGradient,
  AppHeader,
  DimensionSettings,
} from "@skylark-reference-apps/react";
import { useRouter } from "next/router";

const links = [
  { text: "Discover", href: "/" },
  { text: "Movies", href: "/movies" },
  { text: "TV Shows", href: "/player" },
];

function MyApp({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();
  return (
    <div className="relative">
      <AppBackgroundGradient />
      <AppHeader activeHref={asPath} links={links} title="StreamTV" />
      <div className="relative z-10 h-full w-full">
        <Component {...pageProps} />
      </div>
      <DimensionSettings />
    </div>
  );
}

export default MyApp;
