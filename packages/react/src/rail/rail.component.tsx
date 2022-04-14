import React, { useEffect, useRef, useState } from "react";
import { MdArrowForward, MdArrowBack } from "react-icons/md";
import { useDebouncedCallback } from "use-debounce";
import { useTailwindBreakpoint } from "../hooks";
import { Thumbnail, ThumbnailProps } from "../thumbnail";

interface RailProps {
  thumbnails: ThumbnailProps[];
  initial?: number;
}

const directionArrowClassName = `
  absolute hidden sm:flex justify-center items-center
  h-[calc(100%-0.5rem)] bg-gray-900/[.3] hover:bg-gray-900/[.4]
  text-2xl text-gray-400 hover:text-white transition-all z-50
  w-6 md:w-12 lg:w-20
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

export const Rail: React.FC<RailProps> = ({ thumbnails, initial }) => {
  const myRef = useRef<HTMLDivElement>(null);
  const [tailwindBreakpoint] = useTailwindBreakpoint();
  const [showPreviousButton, setShowPreviousButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);
  const [numThumbnailsOnScreen, setNumThumbnailsOnScreen] = useState(2);

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
      thumbnails.length,
      numThumbnailsOnScreen
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
        thumbnails.length,
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
      default:
        numToShow = 4;
        break;
    }
    setNumThumbnailsOnScreen(numToShow);
  }, [tailwindBreakpoint]);

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-center px-2">
        {thumbnails.length > numThumbnailsOnScreen && (
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
            scroll-pr-6 flex-row overflow-x-auto scroll-smooth
            py-1 px-4 hide-scrollbar md:scroll-pr-14
            md:px-12 lg:scroll-pr-20 lg:gap-5
            lg:px-20
          `}
          ref={myRef}
          onScroll={(e) => debouncedOnScroll(e.target as Element)}
        >
          {thumbnails.map((props, i) => (
            <div
              className={`
                mx-1 w-1/2 min-w-[calc(50%-0.75rem)] snap-end
                md:mx-2 md:w-1/3
                md:min-w-[calc(33.333333%-0.8rem)] lg:mx-0
                lg:w-1/4 lg:min-w-[calc(25%-1rem)]
              `}
              key={`${props.title}-${i}`}
            >
              <Thumbnail {...props} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rail;
