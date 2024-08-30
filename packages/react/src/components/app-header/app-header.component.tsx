import React, { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import clsx from "clsx";
import { Navigation, NavigationProps } from "../navigation";
import { useHtmlDirection } from "../../hooks/useHtmlDirection";

export const AppHeader: React.FC<NavigationProps & { forceRtl?: boolean }> = ({
  children,
  links,
  activeHref,
  forceRtl,
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
  return (
    <header
      className={clsx(
        "fixed top-0 z-80 flex w-full flex-col font-display transition-all md:flex-row-reverse",
        fullHeightNavigation ? "md:h-24 lg:h-28" : "md:h-14 lg:h-16",
      )}
      dir={dir}
    >
      <div
        className={`
    fixed z-90 flex h-mobile-header w-full items-center justify-center
    bg-skylarktv-primary md:relative md:h-full md:w-3/5 md:justify-between ltr:md:pr-md-gutter
    rtl:md:pl-md-gutter lg:w-2/3 ltr:lg:pr-lg-gutter rtl:lg:pl-lg-gutter
    ltr:xl:pr-xl-gutter rtl:xl:pl-xl-gutter
  `}
      >
        {children}
      </div>
      <div className="h-full md:w-2/5 lg:w-1/3">
        <Navigation activeHref={activeHref} links={links} />
      </div>
    </header>
  );
};

export default AppHeader;
