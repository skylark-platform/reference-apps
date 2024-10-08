import { motion } from "framer-motion";
import React from "react";

interface SkeletonProps {
  show: boolean;
  isPortrait?: boolean;
}

const item = {
  hidden: {
    opacity: 0,
  },
  show: { opacity: 1, transition: { duration: 1 } },
};

export const Skeleton: React.FC<SkeletonProps> = ({ show, isPortrait }) => (
  <>
    {show && (
      <motion.div
        className="inline-block w-1/6"
        style={{ width: "100%" }}
        variants={item}
      >
        <div
          className={` ${
            isPortrait ? "aspect-h-4 aspect-w-3" : "aspect-h-9 aspect-w-16"
          } animate-pulse rounded-sm bg-gray-700`}
        ></div>
      </motion.div>
    )}
  </>
);
