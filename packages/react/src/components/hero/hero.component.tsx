import React, { useEffect, useState } from "react";

interface HeroProps {
  bgImage: string;
}

export const Hero: React.FC<HeroProps> = ({ bgImage, children }) => {
  const [imageIsLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Load images before they are active
    const image = new Image();
    image.addEventListener("load", () => {
      setImageLoaded(true);
    });
    image.src = bgImage;
  }, [bgImage]);

  return (
    <div
      className={`h-[90vh] w-full bg-cover bg-top bg-no-repeat ${
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
          md:pb-20 md:pl-md-gutter md:pr-0 lg:pl-lg-gutter xl:pl-xl-gutter
        `}
      >
        {children}
      </div>
    </div>
  );
};
