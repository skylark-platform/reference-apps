import React from "react";

interface LabelProps extends React.HTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: JSX.Element;
  iconPlacement?: "left" | "right";
}

export const Thumbnail: React.FC<LabelProps> = ({
  text,
  icon,
  iconPlacement,
  ...otherProps
}) => {
  let className = `
flex justify-center items-center
bg-gray-100
text-gray-900 disabled:text-gray-300 font-body font-bold rounded-2xl
`;

  if (text) {
    className += " px-4 py-0.5 text-xs uppercase";
  } else {
    className += " rounded-full p-1";
  }

  let iconClassName = "text-xl";
  if (icon && text) {
    const rightPlacedIcon = iconPlacement === "right";
    className += ` ${rightPlacedIcon ? "flex-row-reverse" : "flex-row"}`;
    iconClassName += ` ${rightPlacedIcon ? "ml-1" : "mr-1"}`;
  }

  return (
    <button {...otherProps} className={className} type="button">
      {icon && <span className={iconClassName}>{icon}</span>}
      {text && <span className="py-0.5">{text}</span>}
    </button>
  );
};

export default Thumbnail;
