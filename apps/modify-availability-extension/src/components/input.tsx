import clsx from "clsx";
import React from "react";

interface InputProps {
  name: string;
  label: string;
  type: React.HTMLInputTypeAttribute;
  value: string;
  className?: string;
  onChange: (value: string) => void;
}

export const Input = ({
  name,
  label,
  type,
  value,
  className,
  onChange,
}: InputProps) => (
  <div className={clsx("w-full relative mt-2", className)}>
    <label
      className="absolute left-2 top-0 -translate-y-1/2 transform text-xs font-medium uppercase md:left-3  text-manatee-500"
      htmlFor={name}
    >
      <span className="bg-white px-2">{label}</span>
    </label>
    <input
      className="form-input text-sm p-3 md:p-5 rounded-lg border border-gray-200 text-gray-500 w-full"
      name={name}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
