import React from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HProps {
  className?: string;
  children?: React.ReactNode;
}

interface HeadingProps extends HProps {
  level: HeadingLevel;
}

export const H1: React.FC<HProps> = ({ children, className = "" }) => (
  <h1
    className={`text-[44px] font-medium leading-[44px] md:text-[56px] md:leading-[56px] ${className}`}
  >
    {children}
  </h1>
);

export const H2: React.FC<HProps> = ({ children, className = "" }) => (
  <h2
    className={`text-[24px] font-medium leading-[24px] md:text-[32px] md:leading-[36px] ${className}`}
  >
    {children}
  </h2>
);

export const H3: React.FC<HProps> = ({ children, className = "" }) => (
  <h3
    className={`text-[20px] font-medium leading-[24px] md:text-[27px] md:leading-[32px] ${className}`}
  >
    {children}
  </h3>
);

export const H4: React.FC<HProps> = ({ children, className = "" }) => (
  <h4
    className={`text-[16px] font-normal leading-[20px] md:text-[18px] md:leading-[24px] ${className}`}
  >
    {children}
  </h4>
);

export const H5: React.FC<HProps> = ({ children, className = "" }) => (
  <h5
    className={`text-[13px] font-normal leading-[18px] md:text-[14px] md:leading-[20px] ${className}`}
  >
    {children}
  </h5>
);

export const H6: React.FC<HProps> = ({ children, className = "" }) => (
  <h6 className={`text-[12px] font-normal leading-[26px] ${className}`}>
    {children}
  </h6>
);

export const Heading: React.FC<HeadingProps> = ({
  level: propLevel,
  children,
  className,
}) => {
  const headings = [H1, H2, H3, H4, H5, H6];
  let level = 1;
  if (level && propLevel >= 1 && propLevel <= 6) {
    level = propLevel;
  }

  const H = headings[level - 1];

  return <H className={className}>{children}</H>;
};

export default Heading;
