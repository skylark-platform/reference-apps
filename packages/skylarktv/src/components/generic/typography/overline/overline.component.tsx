import React from "react";

export type OverlineLevel = 1 | 2;

interface OverlineProps {
  level: OverlineLevel;
  children?: React.ReactNode;
}

export const Overline: React.FC<OverlineProps> = ({
  level: propLevel,
  children,
}) => {
  let level = 1;
  if (level && propLevel >= 1 && propLevel <= 3) {
    level = propLevel;
  }

  let levelStyles;

  switch (level) {
    case 2:
      levelStyles = "text-[10px] leading-[10px]";
      break;
    default:
      levelStyles = "text-[11px] leading-[11px]";
      break;
  }

  return (
    <p className={`font-bold uppercase text-gray-900 ${levelStyles}`}>
      {children}
    </p>
  );
};

export default Overline;
