import React, { useState } from "react";
import Link from "next/link";
import { MdStream, MdAccountCircle, MdSearch } from "react-icons/md";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import {
  TitleScreen,
  AppBackgroundGradient,
  AppHeader,
  Button,
  DimensionSettings,
  ConnectToSkylarkModal,
} from "../components";
import { DimensionsContextProvider } from "../contexts";

interface Props {
  appTitle: string;
  tvShowsHref: string;
  skylarkApiUrl?: string;
  timeTravelEnabled?: boolean;
}

export const StreamTVLayout: React.FC<Props> = ({
  appTitle,
  tvShowsHref,
  skylarkApiUrl,
  timeTravelEnabled,
  children,
}) => {
  const { asPath } = useRouter();
  const { t } = useTranslation("common");

  const links = [
    { text: t("discover"), href: "/" },
    { text: t("movies"), href: "/movies" },
    { text: t("tv-shows"), href: tvShowsHref },
  ];

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <DimensionsContextProvider>
      <div className="relative w-full">
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
            {/* <Button icon={<MdAccountCircle size={25} />} text={t("sign-in")} />
            <Button externalHref text={t("register")} variant="tertiary" /> */}
            <div className="rounded-full flex text-gray-300 focus-within:text-white bg-button-tertiary justify-center items-center p-3 px-4 border-gray-300 focus-within:border-white focus-within:bg-pink-500 border-0 hover:bg-pink-500 transition-colors">
              <input type="text" placeholder="Search" className="bg-transparent w-36 placeholder:text-gray-300 outline-none px-2 py-0 focus:outline-none focus-visible:outline-none focus:placeholder:text-white focus:border-none border-none shadow-none focus:shadow-none ring-0 focus:ring-0 focus-visible:border-none" />
              <MdSearch className="text-3xl" />
            </div>
          </div>
        </AppHeader>
        <div className="relative z-10 h-full w-full pt-mobile-header md:pt-0">
          {children}
        </div>
        <DimensionSettings
          skylarkApiUrl={skylarkApiUrl}
          timeTravelEnabled={!!timeTravelEnabled}
        />
      </div>
      <ConnectToSkylarkModal
        closeModal={() => setModalOpen(false)}
        isOpen={modalOpen}
      />
    </DimensionsContextProvider>
  );
};
