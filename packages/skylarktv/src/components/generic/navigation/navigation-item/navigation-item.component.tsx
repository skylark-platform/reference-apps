import clsx from "clsx";
import { LinkProps } from "next/link";
import { ReactNode } from "react";
import { Link } from "../../link";

export type NavigationMobileVariant = "bar" | "hamburger";

export type NavigationLink = {
  text: string;
  icon: ReactNode;
  isMobileOnly?: boolean;
} & (
  | { href: LinkProps["href"]; onClick?: never }
  | { onClick: () => void; href?: never }
);

export const NavigationItem = ({
  link,
  activeHref,
  variant,
}: {
  link: NavigationLink;
  activeHref: string;
  variant: "default" | "icon" | "text";
}) => {
  const textAndIcon =
    variant === "default" ? (
      <>
        <span className="max-md:hidden">{link.text}</span>
        <span className="md:hidden">{link.icon}</span>
      </>
    ) : (
      <span>{variant === "text" ? link.text : link.icon}</span>
    );

  const className = clsx(
    "text-xl transition-colors flex justify-center items-center hover:text-white md:text-sm h-full lg:text-base max-md:py-2",
    variant === "icon" ? "px-2" : "max-md:px-8",
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
};
