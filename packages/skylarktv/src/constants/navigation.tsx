import { ReactNode } from "react";
import { MdHome, MdMovie, MdLibraryBooks } from "react-icons/md";
import { LinkProps as NextLinkProps } from "next/link";
import { NavigationMobileVariant } from "../components/generic/navigation/navigation-item/navigation-item.component";

export const CLIENT_NAVIGATION_CONFIG: {
  links: { localeKey: string; href: NextLinkProps["href"]; icon: ReactNode }[];
  mobileVariant: NavigationMobileVariant;
} = {
  links: [
    { localeKey: "discover", href: "/", icon: <MdHome /> },
    { localeKey: "movies", href: "/movies", icon: <MdMovie /> },
    {
      localeKey: "articles",
      href: "/articles",
      icon: <MdLibraryBooks />,
    },
  ],
  mobileVariant: "bar",
};
