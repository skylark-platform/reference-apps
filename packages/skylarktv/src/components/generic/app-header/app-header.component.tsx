import React from "react";
import { Navigation, NavigationProps } from "../navigation";
import { useHtmlDirection } from "../../../hooks/useHtmlDirection";

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
        className={`fixed z-90 flex h-mobile-header w-full items-center justify-center bg-white md:relative md:h-full md:w-1/2 md:justify-between lg:w-2/4 2xl:w-3/5 ltr:md:pr-8 ltr:xl:pr-xl-gutter rtl:md:pl-8 rtl:xl:pl-xl-gutter`}
      >
        {children}
      </div>
      <div className="md:w-2/4f h-full lg:w-2/4 2xl:w-2/5">
        <Navigation activeHref={activeHref} links={links} />
      </div>
    </header>
  );
};

export default AppHeader;
