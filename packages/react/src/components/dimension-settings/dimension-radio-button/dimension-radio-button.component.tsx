import React from "react";

interface Option {
  text: string;
  value: string;
  activeOverride?: boolean;
  disabled?: boolean;
}

interface RadioButtonProps {
  active: Option["value"];
  options: Option[];
  onChange: (value: string) => void;
  labelClassName?: string;
}

export const DimensionRadioButton: React.FC<RadioButtonProps> = ({
  active,
  options,
  onChange,
  labelClassName,
}) => {
  const handleOnChange = (newValue: Option) => {
    onChange(newValue.value);
  };

  return (
    <div className="flex flex-col">
      {options.map((option) => (
        <div className="m-1 flex flex-row items-center" key={option.value}>
          <input
            checked={option.activeOverride || option.value === active}
            className="peer form-radio border-none bg-gray-200 p-3 ring-offset-0 checked:bg-skylark-blue focus:shadow-none focus:outline-none focus:ring-0 disabled:bg-gray-50 md:p-4"
            disabled={option.disabled}
            id={`dimension-radio-${option.value}`}
            type="radio"
            value={option.value}
            onChange={() => handleOnChange(option)}
          />
          <label
            className={`m-2 ml-3 align-top text-sm font-normal text-gray-600 peer-checked:text-black peer-disabled:text-gray-300 ${
              labelClassName || ""
            }`}
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
