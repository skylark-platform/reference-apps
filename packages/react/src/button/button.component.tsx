import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "lg" | "sm";
  text?: string;
  icon?: JSX.Element;
  iconPlacement?: "left" | "right";
  variant?: "primary" | "secondary";
}

const primaryStyles = "bg-button-primary";
const secondaryStyles = "bg-button-secondary";
const largeStyles = "px-6 md:px-10 py-3 text-sm sm:text-base md:text-lg";
const smallStyles = "px-2 md:px-6 py-2 text-xs sm:text-sm md:text-base";
const onlyIconLargeStyles = "p-3";
const onlyIconSmallStyles = "p-2";

export const Button: React.FC<ButtonProps> = ({
  size = "lg",
  text,
  icon,
  iconPlacement,
  variant,
  ...otherProps
}) => {
  let className = `
${variant === "secondary" ? secondaryStyles : primaryStyles}
flex justify-center items-center
hover:bg-button-hover disabled:bg-button-disabled transition-colors
text-white disabled:text-gray-300 font-body rounded-sm
`;

  if (text) {
    className += ` w-full md:w-auto px-2 ${
      size === "lg" ? largeStyles : smallStyles
    }`;
  } else {
    className += ` rounded-full ${
      size === "lg" ? onlyIconLargeStyles : onlyIconSmallStyles
    }`;
  }

  let iconClassName = size === "lg" ? "text-3xl" : "text-2xl";
  if (icon && text) {
    const rightPlacedIcon = iconPlacement === "right";
    className += ` ${rightPlacedIcon ? "flex-row-reverse" : "flex-row"}`;
    iconClassName += ` ${rightPlacedIcon ? "ml-2" : "mr-2"}`;
  }

  return (
    <button {...otherProps} className={className}>
      {icon && <span className={iconClassName}>{icon}</span>}
      {text && <span>{text}</span>}
    </button>
  );
};

export default Button;
