import React, { useState } from "react";

interface Option {
  text: string;
  value: string;
  activeOverride?: boolean;
}

interface RadioButtonProps {
  initial?: Option["value"];
  options: Option[];
  onChange: (value: string) => void;
}

export const DimensionRadioButton: React.FC<RadioButtonProps> = ({
  initial,
  options,
  onChange,
}) => {
  const [active, setActive] = useState(
    options.find((opt) => opt.value === initial)
  );

  const handleOnChange = (newValue: Option) => {
    setActive(newValue);
    onChange(newValue.value);
  };

  return (
    <div className="flex flex-col">
      {options.map((option) => (
        <div className="m-1 flex flex-row items-center" key={option.value}>
          <input
            checked={option.activeOverride || option.value === active?.value}
            className="peer form-radio border-none bg-gray-200 p-3 ring-offset-0 checked:bg-skylark-blue focus:shadow-none focus:outline-none focus:ring-0 md:p-4"
            id={`dimension-radio-${option.value}`}
            type="radio"
            value={option.value}
            onChange={() => handleOnChange(option)}
          />
          <label
            className="m-2 ml-3 align-top text-sm font-normal text-gray-500 peer-checked:text-black"
            htmlFor={`dimension-radio-${option.value}`}
            onClick={() => handleOnChange(option)}
          >
            {option.text}
          </label>
        </div>
      ))}
    </div>
  );
};

export default DimensionRadioButton;
