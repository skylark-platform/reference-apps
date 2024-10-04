import { useEffect, useState } from "react";

const breakpoints = {
  // These are min-widths in px
  // Taken from https://tailwindcss.com/docs/responsive-design
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const convertWidthToBreakpoint = (width: number) => {
  if (width >= breakpoints["2xl"]) {
    return "2xl";
  }
  if (width >= breakpoints.xl) {
    return "xl";
  }
  if (width >= breakpoints.lg) {
    return "lg";
  }
  if (width >= breakpoints.md) {
    return "md";
  }
  if (width >= breakpoints.sm) {
    return "sm";
  }
  return "";
};

export const useTailwindBreakpoint = (initialValue?: string) => {
  const [breakpoint, setBreakpoint] = useState<string | undefined>(
    initialValue,
  );

  const handleResize = () => {
    const newBreakpoint = convertWidthToBreakpoint(window.innerWidth);
    setBreakpoint(newBreakpoint);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return [breakpoint];
};

export default useTailwindBreakpoint;
