import clsx from "clsx";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  success?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export const Button = ({
  children,
  className,
  disabled,
  success,
  danger,
  onClick,
}: ButtonProps) => (
  <button
    className={clsx(
      "px-3 py-2 rounded disabled:bg-manatee-500",
      success && "bg-success text-success-content",
      danger && "bg-error text-white",
      !success && !danger && "bg-brand-primary text-white",
      className
    )}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);
