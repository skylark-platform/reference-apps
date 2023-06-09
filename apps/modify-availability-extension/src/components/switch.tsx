import { Switch as HeadlessUiSwitch } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

interface SwitchProps {
  enabled: boolean;
  disabled?: boolean;
  toggleEnabled: () => void;
}

export const Switch = ({ enabled, disabled, toggleEnabled }: SwitchProps) => (
  <HeadlessUiSwitch
    checked={enabled && !disabled}
    className={clsx(
      "relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 disabled:bg-manatee-500",
      enabled ? "bg-brand-primary" : "bg-error"
    )}
    disabled={disabled}
    onChange={toggleEnabled}
  >
    <span className="sr-only">{`Toggle extension enabled`}</span>
    <span
      aria-hidden="true"
      className={clsx(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
        enabled && !disabled ? "translate-x-4" : "translate-x-0"
      )}
    />
  </HeadlessUiSwitch>
);
