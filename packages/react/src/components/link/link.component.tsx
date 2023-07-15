import React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";

interface IProps extends NextLinkProps {
  isExternal?: boolean;
}

/**
 * Link
 * This component is used to extend next/link to:
 * - Handle External Links
 * - Persist the language query on page navigation
 *
 * You probably don't need this.
 */
export const Link: React.FC<IProps> = ({
  isExternal = false,
  href,
  ...nextLinkProps
}) => {
  const { query: activeQuery } = useRouter();

  if (isExternal) {
    return <a href={href as string}>{nextLinkProps.children}</a>;
  }

  const pathname = typeof href === "object" ? href.pathname : href;

  const propQuery =
    typeof href === "object" && typeof href.query === "object"
      ? href.query
      : {};

  const languageQuery = activeQuery.language
    ? { language: activeQuery.language }
    : {};

  return (
    <NextLink
      {...nextLinkProps}
      href={{
        pathname,
        query: {
          ...languageQuery,
          ...propQuery,
        },
      }}
      legacyBehavior
    />
  );
};

export default Link;
