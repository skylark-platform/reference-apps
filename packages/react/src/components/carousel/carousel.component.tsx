import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import useTranslation from "next-translate/useTranslation";
import {
  addCloudinaryOnTheFlyImageTransformation,
  formatYear,
  ObjectTypes,
} from "@skylark-reference-apps/lib";
import { MdPlayCircleFilled, MdArrowForward } from "react-icons/md";
import { CarouselButton } from "./carousel-button.component";
import { List } from "../list";
import { Button } from "../button";
import { useHtmlDirection } from "../../hooks/useHtmlDirection";

export interface CarouselItem {
  title: string;
  href: string;
  image: string;
  type: ObjectTypes;
  releaseDate: string;
  duration?: string;
  callToAction?: {
    type: "SIGN_UP" | "COMING_SOON" | "LINK_TO_RELATED_OBJECT" | "LINK_TO_URL";
    text: string | null;
    description: string | null;
    url?: string;
    urlPath?: string;
  };
}

interface CarouselProps {
  items: CarouselItem[];
  changeInterval?: number;
  forceRtl?: boolean;
  forceShowCarousel?: boolean;
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
  items: unparsedItems,
  changeInterval,
  forceRtl,
  forceShowCarousel,
}) => {
  const { dir } = useHtmlDirection(forceRtl);

  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [[page, direction], setPage] = useState([0, 0]);
  const [areImagesLoaded, setImagesLoaded] = useState(false);
  const itemIndex = wrap(0, unparsedItems.length, page);

  const items = useMemo(
    () =>
      unparsedItems.map((item) => ({
        ...item,
        image: addCloudinaryOnTheFlyImageTransformation(item.image, {
          width: 2000,
        }),
      })),
    [unparsedItems],
  );

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const loadImage = (url: string) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.addEventListener("load", () => {
          setLoadedImages([...loadedImages, url]);
          resolve(url);
        });
        image.onerror = (err) => reject(err);
      });

    Promise.all(items.map(({ image }) => loadImage(image)))
      .then(() => setImagesLoaded(true))
      .catch((error) => new Error(`Failed to load images: ${error as string}`));
  }, [items]);

  useEffect(() => {
    if (changeInterval && items.length > 1) {
      const timeout = setTimeout(() => {
        paginate(1);
      }, changeInterval * 1000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [page, changeInterval, items.length]);

  const { image, title, releaseDate, type, duration, href, callToAction } =
    items[itemIndex] || {
      image: "",
      title: "",
      releaseDate: "",
      type: "",
      href: "",
    };
  const activeImageHasLoaded =
    (image !== "" && areImagesLoaded) || loadedImages.includes(image);

  const { t } = useTranslation("common");

  const showCarousel = loadedImages.length > 0 || forceShowCarousel;

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden pb-32 md:pb-0`}
      dir={dir}
    >
      {showCarousel && (
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            animate="center"
            className={`absolute block h-full w-full min-w-full bg-cover bg-center bg-no-repeat text-white ${!activeImageHasLoaded ? "animate-pulse bg-gray-800" : ""} `}
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
              className={`flex h-full w-full flex-row items-end justify-between bg-gradient-to-t from-gray-900 to-gray-900/5 px-sm-gutter pb-5 md:px-md-gutter md:pb-20 lg:px-lg-gutter xl:px-xl-gutter`}
            >
              <div className="flex flex-col">
                {title && (
                  <>
                    <h2 className="my-3 text-5xl font-medium md:text-6xl">
                      {title}
                    </h2>
                    <List
                      contents={[
                        duration,
                        formatYear(releaseDate),
                        type && t(`skylark.object.${type}`),
                      ]}
                      highlightFirst
                      textSize="sm"
                    />
                  </>
                )}
                {callToAction && (
                  <>
                    {callToAction.type === "LINK_TO_RELATED_OBJECT" && (
                      <>
                        <div className="mb-4 mt-8 flex flex-row items-center gap-x-4">
                          <Button
                            href={href}
                            icon={<MdPlayCircleFilled size={25} />}
                            iconPlacement="right"
                            text={callToAction.text || undefined}
                          />
                        </div>
                        <p className="text-xs text-gray-300">
                          {callToAction.description}
                        </p>
                      </>
                    )}
                    {callToAction.type === "LINK_TO_URL" && (
                      <>
                        <div className="mb-4 mt-8 flex flex-row items-center gap-x-4">
                          <Button
                            externalHref={
                              (callToAction.url && !callToAction.urlPath) ||
                              false
                            }
                            href={callToAction.urlPath || callToAction.url}
                            icon={<MdArrowForward size={25} />}
                            iconPlacement="right"
                            text={callToAction.text || undefined}
                          />
                        </div>
                        <p className="text-xs text-gray-300">
                          {callToAction.description}
                        </p>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      <div className="absolute bottom-5 z-50 flex items-start justify-center text-white md:bottom-20 ltr:md:right-lg-gutter rtl:md:left-lg-gutter">
        {items.length > 1 &&
          items.map(({ title: itemTitle, image: itemImage }, i) => (
            <CarouselButton
              active={i === itemIndex}
              duration={changeInterval}
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
