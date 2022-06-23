import React, { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

interface DropdownProps {
  label: string;
  items: string[];
  setGenre: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  items,
  setGenre,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [genreName, setGenreName] = useState("");

  const handleOnClick = (item: string) => {
    setGenre(item);
    setGenreName(item);
  };

  return (
    <div className="flex">
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="flex w-56 bg-gray-800">
          <button
            className="
          mb-2
          flex
          w-full
          items-center
          py-2.5
          pl-5
          text-sm
          text-white
          
        "
            type="button"
            onClick={() => setOpen(!isOpen)}
          >
            {genreName || label}
          </button>
          <div className="sm: flex w-full justify-end pr-1 pt-2 text-white">
            <MdArrowDropDown size={25} />
          </div>
        </div>

        {isOpen && (
          <ul className="absolute z-40 h-48 w-full overflow-y-auto lg:h-64">
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
                  type="button"
                  onClick={() => handleOnClick(item)}
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
