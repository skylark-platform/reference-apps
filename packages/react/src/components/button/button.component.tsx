import Link from "next/link";
import React from "react";

interface ButtonProps {
  size?: "xl" | "lg" | "sm";
  text?: string;
  icon?: JSX.Element;
  iconPlacement?: "left" | "right";
  variant?: "primary" | "secondary" | "tertiary" | "outline";
  href?: string;
  externalHref?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const primaryStyles = "bg-button-primary";
const secondaryStyles = "bg-button-secondary";
const tertiaryStyles = "bg-button-tertiary";
const outlineStyles = "text-gray-600 hover:text-gray-100 font-medium";
const xlStyles = "px-8 md:px-10 lg:px-12 py-4 text-base md:text-lg";
const lgStyles =
  "px-4 md:px-6 lg:px-8 xl:px-10 py-2 lg:py-3 text-sm lg:text-base";
const smStyles = "px-2 md:px-4 lg:px-6 py-2 text-xs md:text-sm";
const onlyIconXlStyles = "p-4 md:p-5";
const onlyIconLgStyles = "p-3";
const onlyIconSmStyles = "p-2";

export const Button: React.FC<ButtonProps> = ({
  size = "lg",
  text,
  icon,
  iconPlacement,
  variant = "primary",
  href,
  externalHref,
  disabled,
  onClick,
}) => {
  let className = `
  ${variant === "primary" ? primaryStyles : ""}
  ${variant === "secondary" ? secondaryStyles : ""}
  ${variant === "tertiary" ? tertiaryStyles : ""}
  ${variant === "outline" ? outlineStyles : "text-white disabled:text-gray-300"}
flex justify-center items-center h-full
hover:bg-button-hover disabled:bg-button-disabled transition-colors
font-body rounded-sm cursor-pointer
`;

  if (text) {
    className += ` w-full md:w-fit px-2
      ${size === "sm" ? smStyles : ""}
      ${size === "lg" ? lgStyles : ""}
      ${size === "xl" ? xlStyles : ""}
    `;
  } else {
    className += ` rounded-full
      ${size === "sm" ? onlyIconSmStyles : ""}
      ${size === "lg" ? onlyIconLgStyles : ""}
      ${size === "xl" ? onlyIconXlStyles : ""}
    `;
  }

  let iconClassName = "";
  if (icon && text) {
    const rightPlacedIcon = iconPlacement === "right";
    className += ` ${rightPlacedIcon ? "flex-row-reverse" : "flex-row"}`;
    iconClassName += ` ${rightPlacedIcon ? "ml-2" : "mr-2"}`;
  }

  if (href && !disabled) {
    return (
      <Link href={href}>
        <a className={className} target={externalHref ? "_blank" : undefined}>
          {icon && <span className={iconClassName}>{icon}</span>}
          {text && <span>{text}</span>}
        </a>
      </Link>
    );
  }

  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {icon && <span className={iconClassName}>{icon}</span>}
      {text && <span>{text}</span>}
    </button>
  );
};

export default Button;
