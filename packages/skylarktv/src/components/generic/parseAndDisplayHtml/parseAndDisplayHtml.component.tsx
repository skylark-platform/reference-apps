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
        "prose prose-invert overflow-hidden",
        variant === "default" && "text-sm text-gray-200 md:text-base",
        variant === "tight" &&
          "text-sm text-white marker:text-white prose-p:my-1 prose-p:text-lg prose-p:font-normal prose-p:leading-5 prose-li:text-white",
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
