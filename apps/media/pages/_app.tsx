import "@skylark-reference-apps/react/styles/globals.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/700.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import {
  AppBackgroundGradient,
  AppHeader,
  Button,
  DimensionsContextProvider,
  DimensionSettings,
  TitleScreen,
} from "@skylark-reference-apps/react";
import { useRouter } from "next/router";
import { MdAccountCircle, MdStream } from "react-icons/md";
import Link from "next/link";
// import { appWithTranslation, useTranslation } from "next-i18next";
import useTranslation from "next-translate/useTranslation";
import createDefaultSeo from "../next-seo.config";

const appTitle = "StreamTV";

function MyApp({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();
  const { t } = useTranslation('common');

  const links = [
    { text: t("discover"), href: "/" },
    { text: t("movies"), href: "/movies" },
    { text: t("tv-shows"), href: "/brand/game-of-thrones" },
  ];

  return (
    <DimensionsContextProvider>
      <div className="relative w-full">
        <DefaultSeo {...createDefaultSeo(appTitle)} />
        <TitleScreen
          exitBackgroundColor="#5B45CE"
          logo={
            <MdStream className="h-12 w-12 rounded-md bg-purple-500 sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
          }
          title={appTitle}
        >
          <p className="text-xs text-gray-500 sm:text-sm lg:text-lg">
            {t("by-skylark")}
          </p>
        </TitleScreen>
        <AppBackgroundGradient />
        <AppHeader activeHref={asPath} links={links}>
          <div className="flex items-center justify-center text-3xl text-gray-100">
            <MdStream className="h-9 w-9 md:ml-8 md:h-10 md:w-10 lg:ml-16 lg:h-12 lg:w-12 xl:ml-20" />
            <h2 className="ml-1 text-base md:ml-2 md:text-xl lg:text-2xl">
              <Link href="/">
                <a>{appTitle}</a>
              </Link>
            </h2>
            <span className="absolute right-2 md:hidden">
              <Button
                icon={<MdAccountCircle size={20} />}
                size="sm"
                variant="tertiary"
              />
            </span>
          </div>
          <div className="hidden gap-1 md:flex">
            <Button icon={<MdAccountCircle size={25} />} text={t('sign-in')} />
            <Button text={t('register')} variant="tertiary" />
          </div>
        </AppHeader>
        <div className="relative z-10 h-full w-full pt-mobile-header md:pt-0">
          <Component {...pageProps} />
        </div>
        <DimensionSettings />
      </div>
    </DimensionsContextProvider>
  );
}

export default MyApp;
