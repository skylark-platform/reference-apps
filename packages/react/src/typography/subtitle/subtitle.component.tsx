import React from "react";

export type SubtitleLevel = 1 | 2 | 3;

interface SubtitleProps {
  level: SubtitleLevel;
}

export const Subtitle: React.FC<SubtitleProps> = ({
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
      levelStyles = "text-[14px] leading-[20px]";
      break;
    case 3:
      levelStyles = "text-[12px] leading-[20px]";
      break;
    default:
      levelStyles = "text-[16px] leading-[20px]";
      break;
  }

  return (
    <p
      className={`font-medium text-gray-900 ${levelStyles}`}
      role="doc-subtitle"
    >
      {children}
    </p>
  );
};

export default Subtitle;
