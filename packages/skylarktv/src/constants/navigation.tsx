import { MdHome, MdMovie, MdOutlineStar } from "react-icons/md";

export const CLIENT_NAVIGATION_CONFIG = {
  links: [
    { localeKey: "home", href: "/", icon: <MdHome /> },
    { localeKey: "movies", href: "/movies", icon: <MdMovie /> },
    {
      localeKey: "articles",
      href: "/articles",
      icon: <MdOutlineStar />,
    },
  ],
};
