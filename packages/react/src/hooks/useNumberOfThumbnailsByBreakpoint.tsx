import { useEffect, useState } from "react";
import { useTailwindBreakpoint } from "./useTailwindBreakpoint";

export const useNumberOfThumbnailsByBreakpoint = (initialValue?: number) => {
  const [tailwindBreakpoint] = useTailwindBreakpoint();
  const [numOnScreen, setNumOnScreen] = useState(
    initialValue !== undefined ? initialValue : 2,
  );

  useEffect(() => {
    // The actual number is determined in CSS using the width
    // This function helps decide the amount skipped when next/previous buttons are used
    let numToShow: number;
    switch (tailwindBreakpoint) {
      case "":
      case "sm":
        numToShow = 2;
        break;
      case "md":
        numToShow = 3;
        break;
      case "lg":
        numToShow = 4;
        break;
      case "xl":
        numToShow = 5;
        break;
      default:
        numToShow = 6;
        break;
    }
    setNumOnScreen(numToShow);
  }, [tailwindBreakpoint]);

  return numOnScreen;
};
