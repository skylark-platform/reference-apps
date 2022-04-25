import React from "react";
import { MdArrowDropDown } from "react-icons/md";

interface DimensionToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
}

export const DimensionToggle: React.FC<DimensionToggleProps> = ({
  onClick,
}) => (
  <button>
    <MdArrowDropDown
      className="h-9 w-10 rounded-t-full bg-white p-1"
      type="button"
      onClick={onClick}
    />
  </button>
);

export default DimensionToggle;
