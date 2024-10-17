import React, { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { useNumberOfThumbnailsByBreakpoint } from "../../../hooks/useNumberOfThumbnailsByBreakpoint";
import { useHtmlDirection } from "../../../hooks/useHtmlDirection";

interface RailProps {
  id?: string;
  initial?: number;
  header?: string;
  displayCount?: boolean;
  className?: string;
  children?: React.ReactNode;
  forceRtl?: boolean;
}

const directionArrowClassName = `
  group absolute hidden md:flex justify-center items-center
  h-[calc(100%-0.5rem)] hover:bg-gray-900/[.4]
  text-2xl text-gray-300 hover:text-white transition-all z-50
  md:w-12 lg:w-16 xl:w-24 from-gray-900 to-gray-900/[.4]
`;

const directionArrowIconClassName = "transition-all md:group-hover:scale-110";

const determineScrollAmount = (
  el: Element,
  ascending: boolean,
  totalThumbnails: number,
  numElements: number,
) => {
  const { scrollWidth, scrollLeft } = el;
  const maxValue = scrollWidth;
  const singleValue = maxValue / totalThumbnails;
  const scrollAmount = singleValue * numElements;

  return ascending ? scrollLeft + scrollAmount : scrollLeft - scrollAmount;
};

export const RailHeader = ({
  header,
  displayCount,
  count,
}: {
  header: RailProps["header"];
  displayCount: RailProps["displayCount"];
  count: number;
}) =>
  header ? (
    <div className="mx-sm-gutter flex text-2xl font-normal md:mx-md-gutter lg:mx-lg-gutter xl:mx-xl-gutter">
      <h2 className="text-white">{header}</h2>
      {displayCount && (
        <span className="mx-1 text-gray-500 lg:mx-2">{`(${count})`}</span>
      )}
    </div>
  ) : (
    <></>
  );

export const RailComponent = ({
  id,
  initial,
  children,
  header,
  displayCount,
  className,
  forceRtl,
}: RailProps) => {
  const { dir, isLtr } = useHtmlDirection(forceRtl);

  const numChildren = React.Children.toArray(children).length;

  const myRef = useRef<HTMLDivElement>(null);
  const [showPreviousButton, setShowPreviousButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);
  const numChildrenOnScreen = useNumberOfThumbnailsByBreakpoint();

  const debouncedOnScroll = useDebouncedCallback((e: Element) => {
    const { scrollWidth, scrollLeft, clientWidth } = e;
    // The scroll position relative to the scrollWidth
    const scrollPos = scrollLeft + clientWidth;

    const showPreviousLtr = scrollLeft > 20;
    const showPreviousRtl = scrollLeft < -20;
    const showPrevious = isLtr ? showPreviousLtr : showPreviousRtl;

    const showNextLtr = scrollPos < scrollWidth - 20;
    const showNextRtl = scrollLeft * -1 + clientWidth < scrollWidth - 20;
    const showNext = isLtr ? showNextLtr : showNextRtl;

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
      numChildrenOnScreen,
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
        initial,
      );
      myRef.current.scrollTo({
        left: amount,
      });
    }
  }, [dir]);

  return (
    <div className={`w-full ${className || ""}`} dir={dir} id={id}>
      <RailHeader
        count={numChildren}
        displayCount={displayCount}
        header={header}
      />
      <div className="relative flex items-center justify-center">
        {numChildren > numChildrenOnScreen && (
          <>
            <button
              aria-label="previous-rail-elements-button"
              className={`ltr:left-0 ltr:bg-gradient-to-r rtl:right-0 rtl:bg-gradient-to-l ${directionArrowClassName} ${
                showPreviousButton ? "opacity-100" : "opacity-0"
              }`}
              data-testid="previous-button"
              type="button"
              onClick={() => scrollToNextBlock(!isLtr)}
            >
              {isLtr ? (
                <MdArrowBack className={directionArrowIconClassName} />
              ) : (
                <MdArrowForward className={directionArrowIconClassName} />
              )}
            </button>
            <button
              aria-label="next-rail-elements-button"
              className={`ltr:right-0 ltr:bg-gradient-to-l rtl:left-0 rtl:bg-gradient-to-r ${directionArrowClassName} ${
                showNextButton ? "opacity-100" : "opacity-0"
              }`}
              data-testid="forward-button"
              type="button"
              onClick={() => scrollToNextBlock(!!isLtr)}
            >
              {isLtr ? (
                <MdArrowForward className={directionArrowIconClassName} />
              ) : (
                <MdArrowBack className={directionArrowIconClassName} />
              )}
            </button>
          </>
        )}
        <div
          className={`flex w-full snap-x snap-mandatory scroll-pr-3 flex-row overflow-x-auto scroll-smooth px-gutter py-2 hide-scrollbar sm:scroll-pr-6 sm:px-sm-gutter md:scroll-pr-14 md:px-md-gutter md:py-4 lg:scroll-pr-lg-gutter lg:gap-5 lg:px-lg-gutter xl:scroll-pr-xl-gutter xl:px-xl-gutter`}
          data-testid="rail-scroll"
          ref={myRef}
          onScroll={(e) => debouncedOnScroll(e.target as Element)}
        >
          {/* Add a wrapper around children so that they display correctly */}
          {React.Children.map(children, (child) => (
            <div
              className={`mx-1 w-1/2 min-w-[calc(50%-0.75rem)] max-w-[calc(50%-0.75rem)] md:mx-2 md:w-1/3 md:min-w-[calc(33.333333%-0.8rem)] md:max-w-[calc(33.333333%-0.8rem)] lg:mx-0 lg:w-1/4 lg:min-w-[calc(25%-1rem)] lg:max-w-[calc(25%-1rem)] xl:mx-0 xl:w-1/5 xl:min-w-[calc(20%-1rem)] xl:max-w-[calc(20%-1rem)] 2xl:mx-0 2xl:w-1/6 2xl:min-w-[calc(16.666666%-1rem)] 2xl:max-w-[calc(16.666666%-1rem)] ltr:snap-end rtl:snap-start`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Rail = ({
  showIfEmpty,
  children,
  ...props
}: RailProps & { showIfEmpty?: boolean }) => {
  const numChildren = React.Children.toArray(children).length;

  if (numChildren === 0 && !showIfEmpty) {
    return null;
  }

  return <RailComponent {...props}>{children}</RailComponent>;
};
