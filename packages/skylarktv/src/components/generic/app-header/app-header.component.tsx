import React, { useState } from "react";
import {
  Navigation,
  NavigationItem,
  NavigationProps,
  NavigationToggle,
} from "../navigation";
import { useHtmlDirection } from "../../../hooks/useHtmlDirection";
import { CLIENT_NAVIGATION_CONFIG } from "../../../constants/navigation";

const { mobileVariant } = CLIENT_NAVIGATION_CONFIG;

export const AppHeader: React.FC<NavigationProps & { forceRtl?: boolean }> = ({
  children,
  links,
  activeHref,
  forceRtl,
  search,
}) => {
  const { dir } = useHtmlDirection(forceRtl);

  const [mobileNavIsOpen, setMobileNavIsOpen] = useState(false);

  return (
    <header
      className="fixed top-0 z-80 flex w-full flex-col font-display md:h-24 md:flex-row-reverse lg:h-28"
      dir={dir}
    >
      <div
        className={`fixed z-90 flex h-mobile-header w-full items-center justify-center bg-white md:relative md:h-full md:w-1/2 md:justify-between lg:w-2/4 2xl:w-3/5 ltr:md:pr-8 ltr:xl:pr-xl-gutter rtl:md:pl-8 rtl:xl:pl-xl-gutter`}
      >
        {mobileVariant === "hamburger" && (
          <ul className="absolute right-0 top-0 flex flex-row bg-skylarktv-primary pl-2 md:hidden md:bg-gray-900/80">
            <NavigationItem activeHref="" link={search} variant="icon" />
            <NavigationToggle
              variant={mobileNavIsOpen ? "close" : "open"}
              onClick={() => setMobileNavIsOpen(!mobileNavIsOpen)}
            />
          </ul>
        )}
        {children}
      </div>
      <div className="h-full md:w-2/4 lg:w-2/4 2xl:w-2/5">
        <Navigation
          activeHref={activeHref}
          links={links}
          mobileNavIsOpen={mobileNavIsOpen}
          search={search}
        />
      </div>
    </header>
  );
};

export default AppHeader;
