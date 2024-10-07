import { sanitize } from "dompurify";
import React from "react";

export const ParseAndDisplayHTML = ({
  html,
  fallbackMessage,
}: {
  html: string | null;
  fallbackMessage: string;
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
    <div className="prose prose-invert mb-5 overflow-hidden pt-2 text-sm text-gray-400 md:text-base">
      {cleanHTML ? (
        <p dangerouslySetInnerHTML={{ __html: cleanHTML }} />
      ) : (
        fallbackMessage
      )}
    </div>
  );
};
