import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import {
  convertEntertainmentTypeToString,
  EntertainmentType,
} from "@skylark-reference-apps/lib";
import { MdAdd, MdPlayCircleFilled } from "react-icons/md";
import { CarouselButton } from "./carousel-button.component";
import { List } from "../list";
import { Button } from "../button";

export interface CarouselItem {
  title: string;
  href: string;
  image: string;
  type: EntertainmentType;
  releaseDate: string;
  duration?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  changeInterval?: number;
  activeItem?: number;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export const Carousel: React.FC<CarouselProps> = ({
  items,
  changeInterval,
  activeItem,
}) => {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [[page, direction], setPage] = useState([0, 0]);
  const itemIndex = wrap(0, items.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    // Load images before they are active
    items
      .filter(({ image: src }) => !loadedImages.includes(src))
      .forEach(({ image: src }) => {
        const image = new Image();
        image.addEventListener("load", () => {
          setLoadedImages([...loadedImages, src]);
        });
        image.src = src;
      });
  }, [items, loadedImages, setLoadedImages]);

  useEffect(() => {
    if (activeItem) {
      const newActiveItem =
        activeItem && activeItem < items.length ? activeItem : 0;
      setPage([newActiveItem, direction]);
    }
  }, [activeItem]);

  useEffect(() => {
    if (changeInterval && activeItem === undefined && items.length > 1) {
      const timeout = setTimeout(() => {
        paginate(1);
      }, changeInterval * 1000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [page, changeInterval, activeItem, items.length]);

  const { image, title, releaseDate, type, duration, href } = items[itemIndex];
  const activeImageHasLoaded = loadedImages.includes(image);

  return (
    <div
      className={`
        relative flex h-full w-full items-center
        justify-center overflow-hidden pb-32 md:pb-0
      `}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          animate="center"
          className={`
            absolute block h-full w-full min-w-full
            bg-cover bg-center
            bg-no-repeat text-white
            ${!activeImageHasLoaded ? "animate-pulse bg-gray-800" : ""}
          `}
          custom={direction}
          exit="exit"
          initial="enter"
          key={`${title}-${image}-carousel-item`}
          style={{
            backgroundImage: activeImageHasLoaded ? `url('${image}')` : "",
          }}
          transition={{
            x: { type: "easeIn", stiffness: 300, damping: 30 },
          }}
          variants={variants}
        >
          <div
            className={`
            flex h-full w-full flex-row items-end justify-between bg-gradient-to-t from-gray-900
            to-gray-900/5 px-sm-gutter pb-5
            md:pb-20 md:pr-0 md:pl-md-gutter lg:pl-lg-gutter xl:pl-xl-gutter
          `}
          >
            <div className="flex flex-col">
              <h2 className="my-3 text-5xl font-medium md:text-6xl">{title}</h2>
              <List
                contents={[
                  duration,
                  releaseDate,
                  convertEntertainmentTypeToString(type),
                ]}
                highlightFirst
                textSize="sm"
              />
              <div className="mb-4 mt-8 flex flex-row gap-x-4">
                <Link href={href}>
                  <a>
                    <Button
                      icon={<MdPlayCircleFilled />}
                      iconPlacement="right"
                      text="Watch for free"
                    />
                  </a>
                </Link>
                <Button icon={<MdAdd />} variant="secondary" />
              </div>
              <p className="text-xs text-gray-300">
                {`30 day free trial available. £12.99/mo after.`}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className=" absolute bottom-5 z-50 flex items-start justify-center text-white md:bottom-20 md:right-lg-gutter">
        {items.length > 1 &&
          items.map(({ title: itemTitle, image: itemImage }, i) => (
            <CarouselButton
              active={i === itemIndex}
              duration={activeItem !== undefined ? undefined : changeInterval}
              key={`${itemTitle}-${itemImage}-carousel-button`}
              text={`${i + 1} / ${items.length}`}
              onClick={() => setPage([i, i > itemIndex ? 1 : -1])}
            />
          ))}
      </div>
    </div>
  );
};

export default Carousel;
