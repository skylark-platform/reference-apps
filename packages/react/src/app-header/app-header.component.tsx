import React from "react";
import { Navigation, NavigationProps } from "../navigation";

export const AppHeader: React.FC<NavigationProps> = ({
  children,
  links,
  activeHref,
  defaultOpen,
}) => (
  <header className="fixed top-0 z-80 flex w-full flex-col font-display md:h-24 md:flex-row-reverse lg:h-28">
    <div
      className={`
      fixed z-90 flex h-mobile-header w-full items-center justify-center
      bg-purple-500 md:relative md:h-full md:w-3/5 md:justify-between
      md:pr-md-gutter lg:w-2/3 lg:pr-lg-gutter xl:pr-xl-gutter
    `}
    >
      {children}
    </div>
    <div className="h-full md:w-2/5 lg:w-1/3">
      <Navigation
        activeHref={activeHref}
        defaultOpen={defaultOpen}
        links={links}
      />
    </div>
  </header>
);

export default AppHeader;
