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
      className="fixed top-0 z-80 flex w-full flex-col font-display lg:h-28 lg:flex-row-reverse"
      dir={dir}
    >
      <div
        className={`fixed z-90 flex h-mobile-header w-full items-center justify-center bg-skylarktv-header lg:relative lg:h-full lg:w-1/2 lg:justify-between 2xl:w-3/5 ltr:lg:pr-8 ltr:xl:pr-xl-gutter rtl:lg:pl-8 rtl:xl:pl-xl-gutter`}
      >
        {mobileVariant === "hamburger" && (
          <ul className="absolute right-0 top-0 flex flex-row bg-skylarktv-primary pl-2 lg:hidden lg:bg-gray-900/80">
            <NavigationItem activeHref="" link={search} variant="icon" />
            <NavigationToggle
              variant={mobileNavIsOpen ? "close" : "open"}
              onClick={() => setMobileNavIsOpen(!mobileNavIsOpen)}
            />
          </ul>
        )}
        {children}
      </div>
      <div className="h-full lg:w-2/4 2xl:w-2/5">
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
