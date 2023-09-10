import React from "react";
import { motion } from "framer-motion";

interface CarouselButtonProps {
  active: boolean;
  duration?: number; // In seconds
  text?: string;
  onClick: () => void;
}

export const CarouselButton: React.FC<CarouselButtonProps> = ({
  active,
  duration,
  text,
  onClick,
}) => {
  const drawVariants = {
    hidden: { pathLength: 0, opacity: 0, scale: 0.45 },
    visible: {
      pathLength: 1,
      opacity: 1,
      scale: 1,
      transition: {
        pathLength: { type: "easeInOut", duration, bounce: 0 },
      },
    },
  };

  return (
    <button
      aria-label="carousel-button"
      data-testid="carousel-button"
      type="button"
      onClick={onClick}
    >
      <motion.svg className="chromatic-ignore w-8" viewBox="0 0 100 100">
        <motion.circle
          animate={active ? { scale: 1 } : { scale: 0.45 }}
          className="fill-gray-900/60 stroke-gray-500 stroke-[6]"
          cx="50"
          cy="50"
          r="47"
          transition={{ type: "spring", duration: 0.8 }}
        />
        {duration && active && (
          <motion.circle
            animate="visible"
            className="fill-transparent stroke-streamtv-accent stroke-[6]"
            custom={1}
            cx="50"
            cy="50"
            initial="hidden"
            r="48"
            variants={drawVariants}
          />
        )}
        <circle className="fill-white" cx="50" cy="50" r="10" />
      </motion.svg>
      {text && active && (
        <motion.p
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="hidden pt-1 text-xs md:block"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{
            duration: 0.2,
          }}
        >
          {text}
        </motion.p>
      )}
    </button>
  );
};
