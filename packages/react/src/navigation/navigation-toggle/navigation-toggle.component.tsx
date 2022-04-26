import React from "react";
import { MdClose, MdMenu } from "react-icons/md";

interface NavigationToggleProps {
  variant: "open" | "close";
  onClick: () => void;
}

export const NavigationToggle: React.FC<NavigationToggleProps> = ({
  variant,
  onClick,
}) => (
  <button
    className="bg-gray-900/80 p-5 text-white"
    type="button"
    onClick={onClick}
  >
    {variant === "open" && <MdMenu className="text-xl" />}
    {variant === "close" && <MdClose className="text-xl" />}
  </button>
);

export default NavigationToggle;
