import React from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  level: HeadingLevel;
}

const sharedStyles = "text-gray-900";

export const H1: React.FC = ({ children }) => (
  <h1
    className={`${sharedStyles} text-[44px] font-medium leading-[44px] md:text-[56px] md:leading-[56px]`}
  >
    {children}
  </h1>
);

export const H2: React.FC = ({ children }) => (
  <h2
    className={`${sharedStyles} text-[24px] font-medium leading-[24px] md:text-[32px] md:leading-[36px]`}
  >
    {children}
  </h2>
);

export const H3: React.FC = ({ children }) => (
  <h3
    className={`${sharedStyles} text-[20px] font-medium leading-[24px] md:text-[27px] md:leading-[32px]`}
  >
    {children}
  </h3>
);

export const H4: React.FC = ({ children }) => (
  <h4
    className={`${sharedStyles} text-[16px] font-semibold leading-[20px] md:text-[18px] md:leading-[24px]`}
  >
    {children}
  </h4>
);

export const H5: React.FC = ({ children }) => (
  <h5
    className={`${sharedStyles} text-[13px] font-semibold leading-[18px] md:text-[14px] md:leading-[20px]`}
  >
    {children}
  </h5>
);

export const H6: React.FC = ({ children }) => (
  <h6 className={`${sharedStyles} text-[12px] font-semibold leading-[26px]`}>
    {children}
  </h6>
);

export const Heading: React.FC<HeadingProps> = ({
  level: propLevel,
  children,
}) => {
  const headings = [H1, H2, H3, H4, H5, H6];
  let level = 1;
  if (level && propLevel >= 1 && propLevel <= 6) {
    level = propLevel;
  }

  const H = headings[level - 1];

  return <H>{children}</H>;
};

export default Heading;
