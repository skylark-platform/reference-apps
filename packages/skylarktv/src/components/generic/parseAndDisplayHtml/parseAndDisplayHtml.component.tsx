import clsx from "clsx";
import { sanitize } from "dompurify";
import React from "react";

export const ParseAndDisplayHTML = ({
  html,
  fallbackMessage,
  variant,
  className,
}: {
  html: string | null;
  fallbackMessage: string;
  variant?: "default" | "tight";
  className?: string;
}) => {
  const cleanHTML =
    html &&
    sanitize(html, {
      ADD_TAGS: ["iframe", "script"],
      ADD_ATTR: [
        "allow",
        "allowfullscreen",
        "frameborder",
        "scrolling",
        "async",
        "charset",
      ],
    });

  return (
    <div
      className={clsx(
        "prose prose-invert overflow-hidden prose-p:text-base",
        variant === "default" &&
          "text-xs text-gray-200 sm:text-sm md:text-base",
        variant === "tight" &&
          "text-xs text-white marker:text-white prose-p:my-1 prose-p:text-sm prose-p:font-normal prose-p:leading-5 prose-li:text-white sm:text-sm md:prose-p:text-lg",
        className,
      )}
    >
      {cleanHTML ? (
        <p dangerouslySetInnerHTML={{ __html: cleanHTML }} />
      ) : (
        fallbackMessage
      )}
    </div>
  );
};
