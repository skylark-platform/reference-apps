import clsx from "clsx";
import DOMPurify from "dompurify";
import React from "react";

export const ParseAndDisplayHTML = ({
  html,
  fallbackMessage,
  variant = "default",
  className,
}: {
  html: string | null;
  fallbackMessage: string;
  variant?: "default" | "tight";
  className?: string;
}) => {
  const cleanHTML =
    html &&
    DOMPurify.sanitize(html, {
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
        variant === "default" && "text-sm text-gray-200 md:text-base",
        variant === "tight" &&
          "text-sm text-white marker:text-white prose-p:my-1 prose-p:text-base prose-p:font-normal prose-p:leading-5 prose-li:text-white md:prose-p:text-lg",
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
