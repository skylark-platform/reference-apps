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
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
    });

  return (
    <div className="prose prose-invert mb-5 pt-2 text-sm text-gray-400 md:text-base">
      {cleanHTML ? (
        <p dangerouslySetInnerHTML={{ __html: cleanHTML }} />
      ) : (
        fallbackMessage
      )}
    </div>
  );
};
