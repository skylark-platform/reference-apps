import Link from "next/link";
import React, { useState } from "react";
import { NavigationToggle } from "./navigation-toggle";

interface NavigationProps {
  links: { text: string; href: string }[];
  activeHref: string;
  defaultOpen?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  links,
  activeHref,
  defaultOpen,
}) => {
  const [openOnMobile, setMobileOpen] = useState(defaultOpen || false);
  return (
    <>
      <div className="absolute top-0 left-0 flex md:hidden">
        <NavigationToggle variant="open" onClick={() => setMobileOpen(true)} />
      </div>
      <nav
        className={`
          relative h-screen w-screen items-center justify-center bg-gray-900 text-center
          font-body md:h-full md:w-full md:justify-start md:bg-gray-900/70
          ${openOnMobile ? "flex" : "hidden md:flex"}
        `}
      >
        <div className="absolute top-0 left-0 right-0 flex md:hidden">
          <NavigationToggle
            variant="close"
            onClick={() => setMobileOpen(false)}
          />
          <div className="flex w-full items-center justify-center bg-purple-500 pr-5 text-white">{`StreamTV`}</div>
        </div>
        <ul className="flex flex-col gap-10 md:ml-md-gutter md:flex-row md:gap-6 lg:ml-lg-gutter lg:gap-8 xl:ml-xl-gutter">
          {links.map(({ text, href }) => (
            <li key={text}>
              <Link href={href}>
                <a
                  className={`
                    p-2 text-xl
                    transition-colors hover:text-white md:text-base
                    ${activeHref === href ? "text-white" : "text-gray-500"}
                  `}
                >
                  {text}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
