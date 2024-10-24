import React from "react";
import clsx from "clsx";
import { CLIENT_NAVIGATION_CONFIG } from "../../../constants/navigation";
import {
  NavigationItem,
  NavigationLink,
} from "./navigation-item/navigation-item.component";

export interface NavigationProps {
  links: NavigationLink[];
  search: NavigationLink;
  activeHref: string;
  mobileNavIsOpen?: boolean;
  children?: React.ReactNode;
}

const { mobileVariant } = CLIENT_NAVIGATION_CONFIG;

export const Navigation: React.FC<NavigationProps> = ({
  links,
  search,
  activeHref,
  mobileNavIsOpen,
}) => (
  <nav
    className={clsx(
      `fixed z-60 w-full items-center justify-center bg-gray-900 text-center font-body md:relative md:inset-auto md:h-full md:justify-start md:bg-gray-900/70 md:opacity-100`,
      mobileVariant === "hamburger" &&
        clsx(
          "flex-col md:flex-row",
          mobileNavIsOpen
            ? "bottom-0 left-0 right-0 top-0 flex"
            : "hidden md:flex",
        ),
      mobileVariant === "bar" && "bottom-0 left-0 right-0 flex",
    )}
  >
    <ul
      className={clsx(
        "flex md:gap-6 lg:gap-8 ltr:md:ml-md-gutter ltr:lg:ml-lg-gutter ltr:xl:ml-xl-gutter rtl:md:mr-md-gutter rtl:lg:mr-lg-gutter rtl:xl:mr-xl-gutter",
        mobileVariant === "bar" && "h-14 flex-row",
        mobileVariant === "hamburger" &&
          "flex-col max-md:gap-2 md:h-14 md:flex-row",
      )}
    >
      {links.map((link) => (
        <NavigationItem
          activeHref={activeHref}
          key={link.text}
          link={link}
          variant={mobileVariant === "bar" ? "default" : "text"}
        />
      ))}
      {mobileVariant === "bar" && (
        <NavigationItem
          activeHref={activeHref}
          key={search.text}
          link={search}
          variant={"default"}
        />
      )}
    </ul>
  </nav>
);

export default Navigation;
