import React, { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

interface DropdownProps {
  text: string;
  items: string[];
}

export const Dropdown: React.FC<DropdownProps> = ({ text, items }) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="flex">
      <div
        className="dropdown relative"
        onMouseEnter={() => setDropdown(!dropdown)}
        onMouseLeave={() => setDropdown(!dropdown)}
      >
        <button
          className="
          dropdown-toggle
          mb-2
          flex
          items-center
          bg-gray-600
          py-2.5
          pl-5
          text-sm text-white
          hover:bg-gray-700
          hover:shadow-lg
        "
          type="button"
          onClick={() => setDropdown(!dropdown)}
        >
          {text}
          <div className="sm: flex pl-20 pr-1 md:pl-24">
            <MdArrowDropDown size={25} />
          </div>
        </button>
        <ul className={dropdown ? "" : "hidden"}>
          {items.map((item) => (
            <li key={item}>
              <a
                className="
                block
                bg-white
                py-3
                px-5
                text-xs
                font-semibold
                hover:bg-gray-100
                hover:text-purple-500
                md:text-sm
              "
                href="#"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Dropdown;
