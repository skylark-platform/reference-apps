import clsx from "clsx";
import React from "react";

export const DisabledOverlay = ({ show }: { show: boolean }) => (
  <div
    className={clsx(
      "bg-black/80 absolute inset-0 z-50",
      show ? "visible opacity-100 cursor-not-allowed" : "invisible opacity-0"
    )}
  />
);
