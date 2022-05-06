import React, { useEffect, useRef, useState } from "react";
import { MdArrowForward, MdArrowBack } from "react-icons/md";
import { useDebouncedCallback } from "use-debounce";
import { useTailwindBreakpoint } from "../hooks";

interface RailProps {
  initial?: number;
  header?: string;
}

const directionArrowClassName = `
  absolute hidden md:flex justify-center items-center
  h-[calc(100%-0.5rem)] bg-gray-900/[.3] hover:bg-gray-900/[.4]
  text-2xl text-gray-400 hover:text-white transition-all z-50
  md:w-12 lg:w-16 xl:w-24
`;

const determineScrollAmount = (
  el: Element,
  ascending: boolean,
  totalThumbnails: number,
  numElements: number
) => {
  const { scrollWidth, scrollLeft } = el;
  const maxValue = scrollWidth;
  const singleValue = maxValue / totalThumbnails;
  const scrollAmount = singleValue * numElements;

  return ascending ? scrollLeft + scrollAmount : scrollLeft - scrollAmount;
};

export const Rail: React.FC<RailProps> = ({ initial, children }) => {
  const numChildren = React.Children.toArray(children).length;

  const myRef = useRef<HTMLDivElement>(null);
  const [tailwindBreakpoint] = useTailwindBreakpoint();
  const [showPreviousButton, setShowPreviousButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);
  const [numChildrenOnScreen, setNumChildrenOnScreen] = useState(2);

  const debouncedOnScroll = useDebouncedCallback((e: Element) => {
    const { scrollWidth, scrollLeft, clientWidth } = e;
    // The scroll position relative to the scrollWidth
    const scrollPos = scrollLeft + clientWidth;

    const showPrevious = scrollLeft > 20;
    const showNext = scrollPos < scrollWidth - 20;

    // Only update when values change
    if (showPreviousButton !== showPrevious)
      setShowPreviousButton(showPrevious);
    if (showNextButton !== showNext) setShowNextButton(showNext);
  }, 50);

  const scrollToNextBlock = (ascending: boolean) => {
    const amount = determineScrollAmount(
      myRef.current as Element,
      ascending,
      numChildren,
      numChildrenOnScreen
    );

    myRef.current?.scrollTo({
      left: amount,
    });
  };

  useEffect(() => {
    if (myRef?.current?.scrollTo && initial) {
      const amount = determineScrollAmount(
        myRef.current,
        true,
        numChildren,
        initial
      );
      myRef.current.scrollTo({
        left: amount,
      });
    }
  }, []);

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
    setNumChildrenOnScreen(numToShow);
  }, [tailwindBreakpoint]);

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-center">
        {numChildren > numChildrenOnScreen && (
          <>
            <button
              className={`left-0 ${directionArrowClassName} ${
                showPreviousButton ? "opacity-100" : "opacity-0"
              }`}
              data-testid="previous-button"
              type="button"
              onClick={() => scrollToNextBlock(false)}
            >
              <MdArrowBack />
            </button>
            <button
              className={`right-0 ${directionArrowClassName} ${
                showNextButton ? "opacity-100" : "opacity-0"
              }`}
              data-testid="forward-button"
              type="button"
              onClick={() => scrollToNextBlock(true)}
            >
              <MdArrowForward />
            </button>
          </>
        )}
        <div
          className={`
            flex w-full snap-x snap-mandatory
             scroll-pr-3 flex-row overflow-x-auto
            scroll-smooth py-2
            px-gutter hide-scrollbar
            sm:scroll-pr-6 sm:px-sm-gutter
            md:scroll-pr-14 md:px-md-gutter md:py-4
            lg:scroll-pr-lg-gutter lg:gap-5 lg:px-lg-gutter
            xl:scroll-pr-xl-gutter xl:px-xl-gutter
          `}
          data-testid="rail-scroll"
          ref={myRef}
          onScroll={(e) => debouncedOnScroll(e.target as Element)}
        >
          {/* Add a wrapper around children so that they display correctly */}
          {React.Children.map(children, (child) => (
            <div
              className={`
                mx-1
                w-1/2 min-w-[calc(50%-0.75rem)] max-w-[calc(50%-0.75rem)] snap-end
                md:mx-2 md:w-1/3 md:min-w-[calc(33.333333%-0.8rem)] md:max-w-[calc(33.333333%-0.8rem)]
                lg:mx-0 lg:w-1/4 lg:min-w-[calc(25%-1rem)] lg:max-w-[calc(25%-1rem)]
                xl:mx-0 xl:w-1/5 xl:min-w-[calc(20%-1rem)] xl:max-w-[calc(20%-1rem)]
                2xl:mx-0 2xl:w-1/6 2xl:min-w-[calc(16.666666%-1rem)] 2xl:max-w-[calc(16.666666%-1rem)]
              `}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rail;
