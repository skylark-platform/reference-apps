import { motion } from "framer-motion";
import React, { useState } from "react";
import { useTailwindBreakpoint } from "../../hooks";
import { NavigationToggle } from "./navigation-toggle";
import { Link } from "../link";

export interface NavigationProps {
  links: { text: string; href: string }[];
  activeHref: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

const variants = {
  initialOpen: {
    opacity: 1,
    x: 0,
  },
  open: {
    opacity: 1,
    x: 0,
    display: "flex",
  },
  closed: {
    opacity: 0,
    x: "-100%",
    transitionEnd: {
      display: "none",
    },
  },
};

const transition = {
  type: "spring",
  mass: 0.7,
  damping: 15,
  delay: 0,
};

export const Navigation: React.FC<NavigationProps> = ({
  links,
  activeHref,
  defaultOpen,
}) => {
  const [openOnMobile, setMobileOpen] = useState(defaultOpen || false);
  const [twBreakpoint] = useTailwindBreakpoint("");
  const onDesktop = !["", "sm"].includes(twBreakpoint as string);
  return (
    <>
      <div className="absolute left-0 top-0 z-90 flex md:hidden">
        <NavigationToggle
          variant={openOnMobile ? "close" : "open"}
          onClick={() => setMobileOpen(!openOnMobile)}
        />
      </div>
      <motion.nav
        animate={onDesktop || openOnMobile ? "open" : "closed"}
        className={`
          fixed inset-0 z-80 items-center justify-center bg-gray-900 text-center font-body
          opacity-0 md:relative md:inset-auto md:h-full md:w-full md:justify-start
          md:bg-gray-900/70 md:opacity-100
          ${openOnMobile ? "flex" : "hidden md:flex"}
        `}
        initial="initialOpen"
        transition={transition}
        variants={variants}
      >
        <ul className="flex flex-col gap-10 md:ml-md-gutter md:flex-row md:gap-6 lg:ml-lg-gutter lg:gap-8 xl:ml-xl-gutter">
          {links.map(({ text, href }) => (
            <li key={text}>
              <Link href={href}>
                <a
                  className={`
                    text-xl
                    transition-colors hover:text-white md:text-sm lg:text-base
                    ${activeHref === href ? "text-white" : "text-gray-500"}
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  {text}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </motion.nav>
    </>
  );
};

export default Navigation;
