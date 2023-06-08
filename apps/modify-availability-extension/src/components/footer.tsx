import React from "react";

export const Footer = () => (
  <footer className="py-4 flex items-center justify-start px-4 text-xs bg-manatee-200 w-full">
    {/* <button className="px-4 py-1.5 bg-red-500 rounded mr-4">{`Resume`}</button> */}
    {/* <p>{`When paused, Availability rules won't be applied.`}</p> */}
    <button
      className="px-4 py-1.5 bg-brand-primary text-white rounded mr-4"
      onClick={undefined}
    >{`Refresh`}</button>
    <p>{`Rules are updated automatically, you may need to refresh to see the changes.`}</p>
  </footer>
);
