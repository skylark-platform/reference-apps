import React, { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

interface DropdownProps {
  label: string;
  items: string[];
}

export const Dropdown: React.FC<DropdownProps> = ({ label, items }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="flex">
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          className="
          mb-2
          flex
          items-center
          bg-gray-800
          py-2.5
          pl-5
          text-sm
          text-white
        "
          type="button"
          onClick={() => setOpen(!isOpen)}
        >
          {label}
          <div className="sm: flex pl-20 pr-1 md:pl-24">
            <MdArrowDropDown size={25} />
          </div>
        </button>
        {isOpen && (
          <ul className="absolute z-40 w-full">
            {items.map((item) => (
              <li key={item}>
                <button
                  className="
                  block
                  w-full
                  bg-white
                  py-3
                  px-5
                  text-left
                  text-xs
                  font-semibold
                  hover:bg-gray-100
                  hover:text-purple-500
                  md:text-sm
                  "
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default Dropdown;
