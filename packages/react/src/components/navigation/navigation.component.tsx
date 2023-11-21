import React, { ReactNode } from "react";
import clsx from "clsx";
import { Link } from "../link";

export type NavigationLink = {
  text: string;
  icon: ReactNode;
  isMobileOnly?: boolean;
} & ({ href: string; onClick?: never } | { onClick: () => void; href?: never });

export interface NavigationProps {
  links: NavigationLink[];
  activeHref: string;
  children?: React.ReactNode;
}

export const Navigation: React.FC<NavigationProps> = ({
  links,
  activeHref,
}) => (
  <nav
    className={clsx(
      `fixed bottom-0 left-0 right-0 z-60 flex w-full items-center justify-center bg-gray-900 text-center font-body md:relative md:inset-auto md:h-full md:justify-start md:bg-gray-900/70 md:opacity-100`,
    )}
  >
    <ul className="flex flex-row md:gap-6 ltr:md:ml-md-gutter rtl:md:mr-md-gutter lg:gap-8 ltr:lg:ml-lg-gutter rtl:lg:mr-lg-gutter ltr:xl:ml-xl-gutter rtl:xl:mr-xl-gutter">
      {links.map((link) => {
        const textAndIcon = (
          <>
            <span className="max-md:hidden">{link.text}</span>
            <span className="md:hidden">{link.icon}</span>
          </>
        );

        const className = clsx(
          "text-xl transition-colors block hover:text-white md:text-sm px-8 py-4 h-full lg:text-base",
          link.isMobileOnly && "md:hidden",
        );

        return (
          <li key={link.text}>
            {link.href ? (
              <Link
                className={clsx(
                  className,
                  activeHref === link.href ? "text-white" : "text-gray-500",
                )}
                href={link.href}
              >
                {textAndIcon}
              </Link>
            ) : (
              <button
                className={clsx(className, "text-gray-500")}
                onClick={link.onClick}
              >
                {textAndIcon}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  </nav>
);

export default Navigation;
