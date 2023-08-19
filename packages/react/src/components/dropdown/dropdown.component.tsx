import React, { useState } from "react";
import { MdArrowDropDown, MdOutlineClose } from "react-icons/md";

interface DropdownProps {
  label: string;
  items: string[];
  onChange: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  items,
  onChange,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  const handleOnClick = (item: string) => {
    onChange(item);
    setSelected(item);
    setOpen(false);
  };

  return (
    <div
      className="relative"
      onClick={() => setOpen(!isOpen)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex min-w-56 whitespace-nowrap bg-gray-800 py-1">
        <button
          className="
          flex
          w-full
          items-center
          py-2.5
          text-sm
          text-white
          ltr:pl-5
          rtl:pr-5
        "
          type="button"
          onClick={() => setOpen(!isOpen)}
        >
          {selected || label}
        </button>
        <div className="sm: flex w-full justify-end px-1 pt-2 text-white">
          {!selected && <MdArrowDropDown size={25} />}
          {selected && (
            <div
              className="mr-1 mt-0.5 cursor-pointer"
              data-testid="close-genre"
              onClick={() => handleOnClick("")}
            >
              <MdOutlineClose size={20} />
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <ul className="xl:h-62 absolute z-40 h-44 w-full overflow-y-auto sm:h-48 md:h-52 lg:h-72">
          {items.map((item) => (
            <li key={item}>
              <button
                className="
                  block
                  w-full
                  bg-white
                  px-5
                  py-3
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
  );
};

export default Dropdown;
