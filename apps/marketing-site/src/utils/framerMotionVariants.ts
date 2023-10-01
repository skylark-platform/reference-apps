export const fmFromLeftInitial = {
  x: -100,
  opacity: 0,
};

export const fmFromRightInitial = {
  ...fmFromLeftInitial,
  x: 100,
};

export const fmFromBelowInitial = {
  opacity: 0,
  y: 100,
};

export const fmAnimate = {
  x: 0,
  y: 0,
  opacity: 1,
};

export const fmTransition = {
  delay: 0.1,
  duration: 0.7,
  type: "spring",
};

export const fmViewport = {
  once: true,
  margin: "-100px 0px 0px 0px",
};
