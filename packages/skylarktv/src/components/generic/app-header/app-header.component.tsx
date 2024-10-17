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
        className={`fixed z-90 flex h-mobile-header w-full items-center justify-center bg-skylarktv-primary md:relative md:h-full md:w-3/5 md:justify-between lg:w-2/3 ltr:md:pr-md-gutter ltr:lg:pr-lg-gutter ltr:xl:pr-xl-gutter rtl:md:pl-md-gutter rtl:lg:pl-lg-gutter rtl:xl:pl-xl-gutter`}
      >
        {mobileVariant === "hamburger" && (
          <ul className="absolute right-0 top-0 flex flex-row md:hidden">
            <NavigationItem activeHref="" link={search} variant="icon" />
            <NavigationToggle
              variant={mobileNavIsOpen ? "close" : "open"}
              onClick={() => setMobileNavIsOpen(!mobileNavIsOpen)}
            />
          </ul>
        )}
        {children}
      </div>
      <div className="h-full md:w-2/5 lg:w-1/3">
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
