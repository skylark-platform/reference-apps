import React from "react";
import { MdAccountCircle, MdStream } from "react-icons/md";
import { Navigation, NavigationProps } from "../navigation";
import { Button } from "../button";

interface AppHeaderProps extends NavigationProps {
  title: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  links,
  activeHref,
  defaultOpen,
}) => (
  <header className="fixed z-80 flex w-full flex-col font-display md:h-28 md:flex-row-reverse">
    <div
      className={`
      fixed z-90 flex h-14 w-full items-center justify-center
      bg-purple-500 md:relative md:h-full md:w-3/5 md:justify-between
      md:pr-md-gutter lg:w-2/3 lg:pr-lg-gutter xl:pr-xl-gutter
    `}
    >
      <div className="flex items-center justify-center text-3xl text-gray-100">
        <MdStream className="h-9 w-9 md:ml-8 md:h-12 md:w-12 lg:ml-16 xl:ml-20" />
        <h2 className="ml-1 text-base md:ml-2 md:text-2xl">{title}</h2>
        <span className="absolute right-2 md:hidden">
          <Button icon={<MdAccountCircle />} size="sm" variant="tertiary" />
        </span>
      </div>
      <div className="hidden gap-1 md:flex">
        <Button icon={<MdAccountCircle />} text="Sign in" />
        <Button text="Register" variant="tertiary" />
      </div>
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
