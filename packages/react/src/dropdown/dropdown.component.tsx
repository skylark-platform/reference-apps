import React, { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

interface DropdownProps {
  text: string;
  genres: string[];
}

export const Dropdown: React.FC<DropdownProps> = ({ text, genres }) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="flex justify-start ">
      <div className="dropdown relative ">
        <button
          className="
          dropdown-toggle
          mb-3
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
          <div className="sm: flex pl-20 md:pl-28">
            <MdArrowDropDown size={25} />
          </div>
        </button>
        <ul
          aria-labelledby="dropdownMenuButton1"
          className={dropdown ? "" : "hidden"}
        >
          {genres.map((genre) => (
            <li key={genre}>
              <a
                className="
                block
                py-3
                px-5
                text-xs
                font-semibold
                hover:bg-gray-100
                hover:text-skylark-blue
                md:text-sm
              "
                href="#"
              >
                {genre}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Dropdown;
