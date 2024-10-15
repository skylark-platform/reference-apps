import { ReactNode } from "react";
import { MdHome, MdMovie, MdOutlineStar } from "react-icons/md";
import { LinkProps as NextLinkProps } from "next/link";

export const CLIENT_NAVIGATION_CONFIG: {
  links: { localeKey: string; href: NextLinkProps["href"]; icon: ReactNode }[];
} = {
  links: [
    { localeKey: "discover", href: "/", icon: <MdHome /> },
    { localeKey: "movies", href: "/movies", icon: <MdMovie /> },
    {
      localeKey: "articles",
      href: "/articles",
      icon: <MdOutlineStar />,
    },
  ],
};
