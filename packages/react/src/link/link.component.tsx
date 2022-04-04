import React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

interface IProps extends NextLinkProps {
  isExternal?: boolean;
}

export const Link: React.FC<IProps> = ({
  children,
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  isExternal = false,
}) => {
  if (isExternal) {
    return <a href={href as string}>{children}</a>;
  }

  return (
    <NextLink
      {...{ href, as, replace, scroll, shallow, prefetch, locale }}
      passHref
    >
      <a className="bg-red-500 text-4xl font-extrabold">{children}</a>
    </NextLink>
  );
};

export default Link;
