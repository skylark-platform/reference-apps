import React, { useEffect, useMemo, useState } from "react";
import { MdStream, MdSearch, MdClose } from "react-icons/md";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { DefaultSeo } from "next-seo";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Search } from "./search";
import {
  SkylarkTVConfig,
  useSkylarkTVConfig,
} from "../hooks/useSkylarkTVConfig";
import createDefaultSeo from "../../next-seo.config";
import { GoogleTagManagerScript } from "./googleTagManager";
import { BackButton } from "./backButton";
import { useDimensions } from "../contexts";
import {
  addCloudinaryOnTheFlyImageTransformation,
  hasProperty,
  skylarkRequestWithLocalStorage,
} from "../lib/utils";
import { AppBackgroundGradient } from "./generic/app-background-gradient";
import { AppHeader } from "./generic/app-header";
import { Button } from "./generic/button";
import { ConnectToSkylarkModal } from "./generic/connect-to-skylark-modal";
import { TitleScreen } from "./generic/title-screen";
import { Link } from "./generic/link";
import { CLIENT_APP_CONFIG } from "../constants/app";
import { CLIENT_NAVIGATION_CONFIG } from "../constants/navigation";
import { APP_TITLE } from "../constants/env";
import { PURGE_CACHE } from "../graphql/queries/purgeCache";
import { useUser } from "../hooks/useUserAccount";
import { DimensionSettings } from "./generic/dimension-settings";
import { SkylarkApiPermission } from "../types";
import { NavigationLink } from "./generic/navigation";

interface Props {
  skylarkApiUrl?: string;
  children?: React.ReactNode;
}

const Logo = ({ config }: { config?: SkylarkTVConfig }) => {
  const configLogo =
    config?.loadingLogo ||
    config?.logo ||
    CLIENT_APP_CONFIG.loadingScreen?.logo ||
    CLIENT_APP_CONFIG.header?.logo;
  if (configLogo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={configLogo.alt}
        className="block max-h-20"
        key={configLogo.src}
        src={addCloudinaryOnTheFlyImageTransformation(configLogo.src, {
          height: 100,
        })}
      />
    );
  }

  return (
    <MdStream
      className="h-12 w-12 rounded-md bg-skylarktv-primary sm:h-14 sm:w-14 lg:h-16 lg:w-16"
      key="default"
    />
  );
};

export const SkylarkTVLayout: React.FC<Props> = ({
  skylarkApiUrl,
  children,
}) => {
  const { config } = useSkylarkTVConfig();

  const appTitle = config?.appName || APP_TITLE || CLIENT_APP_CONFIG.name;

  const { asPath, query } = useRouter();
  const { t } = useTranslation("common");
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);

  const links: NavigationLink[] = useMemo(
    (): NavigationLink[] =>
      CLIENT_NAVIGATION_CONFIG.links.map(
        ({ localeKey, ...rest }): NavigationLink => ({
          text: t(localeKey),
          ...rest,
        }),
      ),
    [],
  );

  const [modalOpen, setModalOpen] = useState(false);

  const skipTitleScreen = hasProperty(query, "skipTitleScreen");

  const {
    dimensions: { language },
    setRegion,
  } = useDimensions();

  useEffect(() => {
    if (language === "ar") {
      setRegion("mena");
    }
  }, [language]);

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

  const { permissions } = useUser();

  const includeDimensionSettings = !permissions || permissions.length > 1;

  return (
    <>
      <DefaultSeo
        {...createDefaultSeo(
          appTitle,
          CLIENT_APP_CONFIG?.description || t("seo.description"),
        )}
      />
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
              <Logo
                config={config}
                key={config?.loadingLogo?.src || config?.logo?.src || "logo"}
              />
            }
            title={
              !config?.loadingLogo &&
              !CLIENT_APP_CONFIG.loadingScreen?.hideAppName
                ? appTitle
                : ""
            }
          >
            {CLIENT_APP_CONFIG.showBySkylark && (
              <p className="text-xs text-gray-500 sm:text-sm lg:text-lg">
                {t("by-skylark")}
              </p>
            )}
          </TitleScreen>
        )}
        <AppBackgroundGradient />
        <AppHeader
          activeHref={asPath}
          links={links}
          search={{
            text: t("search"),
            onClick: () => setMobileSearchOpen(!isMobileSearchOpen),
            icon: <MdSearch />,
            isMobileOnly: true,
          }}
        >
          <div className="flex h-full items-center justify-center text-3xl text-gray-100">
            <BackButton />
            <Link
              className="flex h-full items-center ltr:md:ml-8 ltr:lg:ml-16 ltr:xl:ml-20 rtl:md:mr-8 rtl:lg:mr-16 rtl:xl:mr-20"
              href="/"
            >
              {config?.logo || CLIENT_APP_CONFIG.header?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={config?.logo?.alt || CLIENT_APP_CONFIG.header?.logo.alt}
                  className="block h-full max-h-8 py-1 md:max-h-16 md:py-2 lg:py-3"
                  src={addCloudinaryOnTheFlyImageTransformation(
                    (config?.logo?.src ||
                      CLIENT_APP_CONFIG.header?.logo.src) as string,
                    { height: 100 },
                  )}
                />
              ) : (
                <MdStream className="h-9 w-9 md:h-10 md:w-10 lg:h-12 lg:w-12" />
              )}
              {!CLIENT_APP_CONFIG.header?.hideAppName && (
                <h2 className="mx-1 text-base md:mx-2 md:text-xl lg:text-2xl">
                  {appTitle}
                </h2>
              )}
            </Link>
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
        {includeDimensionSettings &&
          !CLIENT_APP_CONFIG.hideDimensionsSettings && (
            <DimensionSettings
              skylarkApiUrl={skylarkApiUrl}
              timeTravelEnabled={
                !permissions ||
                permissions.includes(SkylarkApiPermission.TimeTravel)
              }
              onCachePurge={() => purgeCache({})}
            />
          )}
      </div>
      <ConnectToSkylarkModal
        closeModal={() => setModalOpen(false)}
        isOpen={modalOpen}
      />
    </>
  );
};
