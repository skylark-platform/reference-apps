import { motion } from "framer-motion";
import React from "react";

interface SkeletonProps {
  show: boolean;
}

const item = {
  hidden: {
    opacity: 0,
  },
  show: { opacity: 1, transition: { duration: 1 } },
};

export const Skeleton: React.FC<SkeletonProps> = ({ show = true }) => (
  <>
    {show && (
      <motion.div
        className="inline-block  w-1/6"
        style={{ width: "100%" }}
        variants={item}
      >
        <div className="aspect-w-16 aspect-h-9 animate-pulse rounded-sm bg-gray-700"></div>
      </motion.div>
    )}
  </>
);

export default Skeleton;
