import React, { useEffect, useState } from "react";
import {
  MdStream,
  MdSearch,
  MdClose,
  MdHome,
  MdOutlineStar,
  MdMovie,
} from "react-icons/md";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import {
  TitleScreen,
  AppBackgroundGradient,
  AppHeader,
  Button,
  DimensionSettings,
  ConnectToSkylarkModal,
  Link,
  useDimensions,
  NavigationLink,
  skylarkRequestWithLocalStorage,
} from "@skylark-reference-apps/react";
import {
  addCloudinaryOnTheFlyImageTransformation,
  hasProperty,
} from "@skylark-reference-apps/lib";
import { DefaultSeo } from "next-seo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "./search";
import { useStreamTVConfig } from "../hooks/useStreamTVConfig";
import createDefaultSeo from "../next-seo.config";
import { GoogleTagManagerScript } from "./googleTagManager";
import { BackButton } from "./backButton";
import { PURGE_CACHE } from "../graphql/queries/purgeCache";

interface Props {
  skylarkApiUrl?: string;
  timeTravelEnabled?: boolean;
  children?: React.ReactNode;
}

export const StreamTVLayout: React.FC<Props> = ({
  skylarkApiUrl,
  timeTravelEnabled,
  children,
}) => {
  const { config } = useStreamTVConfig();

  const appTitle =
    config?.appName || process.env.NEXT_PUBLIC_APP_TITLE || "StreamTV";

  const { asPath, query } = useRouter();
  const { t } = useTranslation("common");
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);

  const links: NavigationLink[] = [
    { text: t("discover"), href: "/", icon: <MdHome /> },
    { text: t("movies"), href: "/movies", icon: <MdMovie /> },
    {
      text: t("articles"),
      href: "/articles",
      icon: <MdOutlineStar />,
    },
    {
      text: t("search"),
      onClick: () => setMobileSearchOpen(!isMobileSearchOpen),
      icon: <MdSearch />,
      isMobileOnly: true,
    },
  ];

  const [modalOpen, setModalOpen] = useState(false);

  const skipTitleScreen = hasProperty(query, "skipTitleScreen");

  const { dimensions, setRegion } = useDimensions();

  useEffect(() => {
    if (dimensions.language === "ar") {
      setRegion("mena");
    }
  }, [dimensions.language]);

  const queryClient = useQueryClient();

  const { mutate: purgeCache } = useMutation({
    mutationKey: ["purgeCache"],
    mutationFn: () => skylarkRequestWithLocalStorage(PURGE_CACHE, {}, {}),
    onSuccess: () => {
      queryClient.clear();
      // eslint-disable-next-line no-console
      console.log("Skylark cache cleared.");
    },
    // eslint-disable-next-line no-console
    onError: console.error,
  });

  return (
    <>
      <DefaultSeo {...createDefaultSeo(appTitle, t("seo.description"))} />
      {config?.googleTagManagerId && (
        <GoogleTagManagerScript id={config.googleTagManagerId} />
      )}
      <div className="relative w-full">
        {isMobileSearchOpen && (
          <div className="fixed inset-0 z-80 bg-gray-800 md:hidden">
            <Search onSearch={() => setMobileSearchOpen(false)} />
          </div>
        )}
        {!skipTitleScreen && (
          <TitleScreen
            exitBackgroundColor="#5B45CE"
            logo={
              config?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={config.logo.alt}
                  className="block max-h-20"
                  src={config.logo.src}
                />
              ) : (
                <MdStream className="h-12 w-12 rounded-md bg-streamtv-primary sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
              )
            }
            title={appTitle}
          >
            <p className="text-xs text-gray-500 sm:text-sm lg:text-lg">
              {t("by-skylark")}
            </p>
          </TitleScreen>
        )}
        <AppBackgroundGradient />
        <AppHeader activeHref={asPath} links={links}>
          <div className="flex h-full items-center justify-center text-3xl text-gray-100">
            <BackButton />
            <div className="flex h-full items-center ltr:md:ml-8 rtl:md:mr-8 ltr:lg:ml-16 rtl:lg:mr-16 ltr:xl:ml-20 rtl:xl:mr-20">
              {config?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={config.logo.alt}
                  className="block h-full py-2 md:py-4 lg:py-8"
                  src={addCloudinaryOnTheFlyImageTransformation(
                    config.logo.src,
                    { height: 100 },
                  )}
                />
              ) : (
                <MdStream className="h-9 w-9 md:h-10 md:w-10 lg:h-12 lg:w-12" />
              )}
            </div>
            <h2 className="mx-1 text-base md:mx-2 md:text-xl lg:text-2xl">
              <Link href="/">{appTitle}</Link>
            </h2>
            <span className="absolute right-2 top-16 md:hidden">
              {isMobileSearchOpen && (
                <Button
                  icon={
                    isMobileSearchOpen ? (
                      <MdClose size={20} />
                    ) : (
                      <MdSearch size={20} />
                    )
                  }
                  size="sm"
                  variant="tertiary"
                  onClick={() => setMobileSearchOpen(!isMobileSearchOpen)}
                />
              )}
            </span>
          </div>
          <div className="hidden md:block">
            <Search />
          </div>
        </AppHeader>
        <div className="relative z-10 h-full w-full pt-mobile-header md:pt-0">
          {children}
        </div>
        <DimensionSettings
          skylarkApiUrl={skylarkApiUrl}
          timeTravelEnabled={!!timeTravelEnabled}
          onCachePurge={() => purgeCache({})}
        />
      </div>
      <ConnectToSkylarkModal
        closeModal={() => setModalOpen(false)}
        isOpen={modalOpen}
      />
    </>
  );
};
