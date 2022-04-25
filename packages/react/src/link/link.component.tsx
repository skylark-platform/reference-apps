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
      <a className="bg-blue-500 font-sans text-4xl font-extrabold tracking-widest backdrop-hue-rotate-30">
        {children}
      </a>
    </NextLink>
  );
};

export default Link;
