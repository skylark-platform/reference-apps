import React from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

interface DimensionToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  iconDir: "up" | "down";
  onClick: () => void;
}

export const DimensionToggle: React.FC<DimensionToggleProps> = ({
  iconDir,
  onClick,
}) => (
  <button
    className="flex h-10 items-center justify-center rounded-t-full bg-white px-2 pt-1"
    type="button"
    onClick={onClick}
  >
    {iconDir === "up" && <MdArrowDropUp className="text-3xl" />}
    {iconDir === "down" && <MdArrowDropDown className="text-3xl" />}
  </button>
);

export default DimensionToggle;
