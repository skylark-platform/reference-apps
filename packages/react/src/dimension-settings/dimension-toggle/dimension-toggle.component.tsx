import React from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

interface DimensionToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant: "open" | "close";
  onClick: () => void;
}

export const DimensionToggle: React.FC<DimensionToggleProps> = ({
  variant,
  onClick,
}) => (
  <button
    className="flex h-10 items-center justify-center rounded-t-full bg-white px-2 pt-1"
    type="button"
    onClick={onClick}
  >
    {variant === "open" && <MdArrowDropUp className="text-3xl" />}
    {variant === "close" && <MdArrowDropDown className="text-3xl" />}
  </button>
);

export default DimensionToggle;
