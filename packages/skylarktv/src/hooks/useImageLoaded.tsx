import { useEffect, useState } from "react";

export const useImageLoaded = (src: string) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageLoaded) setImageLoaded(false);

    const image = new Image();
    image.addEventListener("load", () => {
      setImageLoaded(true);
    });

    image.src = src;
    if (image.complete) {
      setImageLoaded(true);
    }
  }, [src]);

  return imageLoaded;
};
