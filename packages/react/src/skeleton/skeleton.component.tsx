import { motion } from "framer-motion";
import React from "react";
import { useNumberOfThumbnailsByBreakpoint } from "../hooks";

interface SkeletonProps {
  show: boolean;
}

const container = {
  exit: {
    opacity: 0,
  },
  show: { opacity: 1 },
};

const wrapper = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 1,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
  },
  show: { opacity: 1, transition: { duration: 1 } },
};

export const Skeleton: React.FC<SkeletonProps> = ({
  show = true,
  children,
}) => {
  const numPerRow = useNumberOfThumbnailsByBreakpoint(0);
  // 4 Rows of Skeleton max
  const arr = Array.from({ length: numPerRow * 4 }, (_, i) => i);
  return (
    <>
      {show && arr.length > 0 && (
        <motion.div
          animate="show"
          // className="fixed inset-0 z-[999] pt-mobile-header md:pt-48 px-sm-gutter md:py-12 md:px-md-gutter w-full lg:px-lg-gutter xl:px-xl-gutter bg-gray-900"
          className="h-auto w-full px-sm-gutter md:px-md-gutter lg:px-lg-gutter xl:px-xl-gutter"
          exit="exit"
          initial=""
          variants={container}
        >
          <motion.div
            animate="show"
            className="flex-wrap"
            exit="hidden"
            initial="hidden"
            variants={wrapper}
          >
            {arr.map((_, index) => (
              <motion.div
                className="inline-block w-1/6 px-2 pb-4"
                key={`skeleton-${index}`}
                style={{ width: `${100 / numPerRow}%` }}
                variants={item}
              >
                <div className="aspect-w-16 aspect-h-9 animate-pulse rounded-sm bg-gray-700"></div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
      {!show && children && (
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
};

export default Skeleton;
