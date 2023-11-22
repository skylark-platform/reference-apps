import React from "react";
import { useImageLoaded } from "../../hooks/useImageLoaded";

interface HeroProps {
  bgImage: string;
  children?: React.ReactNode;
}

export const Hero: React.FC<HeroProps> = ({ bgImage, children }) => {
  const imageIsLoaded = useImageLoaded(bgImage);

  return (
    <div
      className={`h-[88vh] w-full bg-cover bg-top bg-no-repeat ${
        !imageIsLoaded ? "animate-pulse bg-gray-800" : ""
      }`}
      style={{
        backgroundImage: imageIsLoaded ? `url('${bgImage}')` : "",
      }}
    >
      <div
        className={`
          flex h-full w-full flex-row items-end justify-between bg-gradient-to-t from-gray-900
          to-gray-900/5 px-sm-gutter pb-5
          md:px-md-gutter md:pb-20  lg:px-lg-gutter xl:px-xl-gutter
        `}
      >
        {children}
      </div>
    </div>
  );
};
