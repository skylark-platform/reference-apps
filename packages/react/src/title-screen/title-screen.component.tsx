import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

interface TitleScreenProps {
  title: string;
  logo?: JSX.Element;
}

const durationToShowAfterAnimationComplete = 0.4;

const container = {
  exit: {
    opacity: 0,
    transition: {
      delay: durationToShowAfterAnimationComplete,
      duration: 1,
    },
    backgroundColor: "#5B45CE",
  },
  show: { opacity: 1 },
};

const character = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 },
};

export const TitleScreen: React.FC<TitleScreenProps> = ({ title, logo }) => {
  const staggerCharacter = 0.7 / title.length;
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

  const skylarkDemoText = {
    hidden: { opacity: 0, y: -30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
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
          <motion.p
            animate="show"
            className="flex items-center text-xs text-gray-500 sm:text-sm lg:text-lg"
            exit="exit"
            initial="hidden"
            variants={skylarkDemoText}
            onAnimationComplete={() => setShow(false)}
          >
            {`by Skylark`}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TitleScreen;
