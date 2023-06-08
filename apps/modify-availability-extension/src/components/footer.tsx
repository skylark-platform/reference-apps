import React from "react";

export const Footer = () => (
  <footer className="h-16 flex items-center justify-start px-4 text-xs bg-manatee-200 w-full mt-6">
    <button className="px-4 py-1.5 bg-red-500 rounded mr-4">{`Resume`}</button>
    <p>{`When paused, Availability rules won't be applied.`}</p>
  </footer>
);
