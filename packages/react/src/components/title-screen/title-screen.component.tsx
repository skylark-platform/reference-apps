import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

interface TitleScreenProps {
  title: string;
  logo?: JSX.Element;
  exitBackgroundColor?: string;
  children?: React.ReactNode;
}

const durationToShowAfterAnimationComplete = 0.4;

const character = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 },
};

export const TitleScreen: React.FC<TitleScreenProps> = ({
  title,
  logo,
  exitBackgroundColor,
  children,
}) => {
  const staggerCharacter = 0.7 / title.length;

  const container = {
    exit: {
      opacity: 0,
      transition: {
        delay: durationToShowAfterAnimationComplete,
        duration: 1,
      },
      backgroundColor: exitBackgroundColor,
    },
    show: { opacity: 1 },
  };

  const text = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.8,
        staggerChildren: staggerCharacter,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      scale: 2,
      transition: {
        duration: 0.6,
        delay: durationToShowAfterAnimationComplete,
      },
    },
  };

  const childrenVariants = {
    hidden: { opacity: 0, y: -30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        // Ensure it runs after the title animation
        delay:
          title.length * staggerCharacter +
          text.show.transition.delayChildren +
          0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        delay: durationToShowAfterAnimationComplete,
        duration: 0.15,
      },
    },
  };

  const [show, setShow] = useState(true);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-y-1 bg-gray-900 font-display text-white sm:gap-y-2 lg:gap-y-4"
          exit="exit"
          initial="show"
          variants={container}
        >
          <motion.p
            animate="show"
            className="flex items-center text-4xl text-white sm:text-5xl lg:text-6xl"
            exit="exit"
            initial="hidden"
            variants={text}
          >
            {logo && (
              <motion.span
                className="mr-2 inline-block md:mr-4"
                variants={character}
              >
                {logo}
              </motion.span>
            )}
            {title.split("").map((item, i) => (
              <motion.span
                className="inline-block"
                key={i}
                variants={character}
              >
                {item === " " ? <>&nbsp;</> : item}
              </motion.span>
            ))}
          </motion.p>
          <motion.div
            animate="show"
            className="flex flex-col items-center justify-center"
            exit="exit"
            initial="hidden"
            variants={childrenVariants}
            onAnimationComplete={() => setShow(false)}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TitleScreen;
