import React from "react";
import { Navigation, NavigationProps } from "../navigation";
import { useHtmlDirection } from "../../hooks/useHtmlDirection";

export const AppHeader: React.FC<NavigationProps & { forceRtl?: boolean }> = ({
  children,
  links,
  activeHref,
  forceRtl,
}) => {
  const { dir } = useHtmlDirection(forceRtl);
  return (
    <header
      className="fixed top-0 z-80 flex w-full flex-col font-display md:h-24 md:flex-row-reverse lg:h-28"
      dir={dir}
    >
      <div
        className={`
    fixed z-90 flex h-mobile-header w-full items-center justify-center
    bg-streamtv-primary md:relative md:h-full md:w-3/5 md:justify-between ltr:md:pr-md-gutter
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
