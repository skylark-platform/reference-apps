import React, { useState } from "react";

interface RadioButtonProps {
  options: string[];
  onChange: (value: string) => void;
}

export const DimensionRadioButton: React.FC<RadioButtonProps> = ({
  options,
  onChange,
}) => {
  const [value, setValue] = useState(options[0]);

  const handleOnChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col">
      {options.map((option) => (
        <div className="m-1 flex flex-row items-center" key={option}>
          <input
            checked={option === value}
            className="peer form-radio border-none bg-gray-200 p-3 ring-offset-0 checked:bg-skylark-blue focus:shadow-none focus:outline-none focus:ring-0 md:p-4"
            type="radio"
            value={option}
            onChange={() => handleOnChange(option)}
          />
          <label
            className="m-2 ml-3 align-top text-sm font-medium text-gray-500 peer-checked:text-black"
            onClick={() => handleOnChange(option)}
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default DimensionRadioButton;
