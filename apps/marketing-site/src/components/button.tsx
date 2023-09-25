import clsx from "clsx";
import { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonProps {
  variant: ButtonVariant;
  children?: ReactNode;
  onClick?: () => void;
  disableHover?: boolean;
}

export const Button = ({
  variant,
  disableHover,
  children,
  onClick,
}: ButtonProps) => (
  <button
    className={clsx(
      "min-w-36 rounded-full px-8 py-2 font-medium shadow transition-colors",
      !disableHover && "hover:bg-skylark-orange hover:text-black",
      variant === "primary" && "bg-skylark-blue text-white",
      variant === "secondary" && "bg-black text-white",
      variant === "tertiary" && "bg-white text-black",
    )}
    onClick={onClick}
  >
    {children}
  </button>
);
