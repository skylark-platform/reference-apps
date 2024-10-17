import React, { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import clsx from "clsx";
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
  const { scrollYProgress } = useScroll();

  const [fullHeightNavigation, setFullHeightNavigation] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (scrollY) => {
    if (fullHeightNavigation && scrollY > 0.001) {
      setFullHeightNavigation(false);
    } else if (!fullHeightNavigation && scrollY <= 0.001) {
      setFullHeightNavigation(true);
    }
  });

  const { dir } = useHtmlDirection(forceRtl);

  const [mobileNavIsOpen, setMobileNavIsOpen] = useState(false);

  return (
    <header
      className={clsx(
        "fixed top-0 z-80 flex w-full flex-col font-display transition-all md:flex-row-reverse",
        fullHeightNavigation ? "md:h-24 lg:h-28" : "md:h-14 lg:h-16",
      )}
      dir={dir}
    >
      <div
        className={`fixed z-90 flex h-mobile-header w-full items-center justify-center bg-skylarktv-primary md:relative md:h-full md:w-3/5 md:justify-between lg:w-2/3 ltr:md:pr-md-gutter ltr:lg:pr-lg-gutter ltr:xl:pr-xl-gutter rtl:md:pl-md-gutter rtl:lg:pl-lg-gutter rtl:xl:pl-xl-gutter`}
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
