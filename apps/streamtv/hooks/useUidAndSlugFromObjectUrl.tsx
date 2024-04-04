import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";

export const getUidAndSlugFromQuery = (query: ParsedUrlQuery, key = "slug") => {
  const querySlug = query?.[key];

  const uid =
    querySlug && Array.isArray(querySlug) && querySlug.length >= 1
      ? querySlug[0]
      : null;

  const slug =
    querySlug && Array.isArray(querySlug) && querySlug.length >= 2
      ? querySlug[1]
      : null;

  // Fallback for then [slug].tsx is used rather than [...slug].tsx
  if (!uid && !slug && querySlug && typeof querySlug === "string") {
    return {
      uid: querySlug,
      slug: null,
    };
  }

  return { uid, slug };
};

export const useUidAndSlugFromObjectUrl = () => {
  const { query } = useRouter();

  const { uid, slug } = getUidAndSlugFromQuery(query);

  return {
    uid,
    slug,
  };
};

export const useAddSlugToObjectUrl = (object?: { slug?: string | null }) => {
  const { query, push, asPath } = useRouter();

  const { uid, slug } = getUidAndSlugFromQuery(query);

  const [updatedUrl, setUpdatedUrl] = useState<{
    url: string;
    path: string;
  } | null>(null);

  useEffect(() => {
    if (!updatedUrl && object && uid) {
      const basePath = `${asPath.split(uid)[0]}${uid}`;
      const pathWithSlug = object?.slug
        ? `${basePath}/${object?.slug}`
        : basePath;

      if (slug !== object?.slug) {
        void push(pathWithSlug, pathWithSlug, { shallow: true });
      }

      setUpdatedUrl({
        path: pathWithSlug,
        url: `${window.location.origin}${pathWithSlug}`,
      });
    }
  }, [slug, object, uid, asPath]);

  return updatedUrl;
};
