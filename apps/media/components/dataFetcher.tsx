import React, { FC, ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import {
  AllEntertainment,
  convertUrlToObjectType,
  EntertainmentType,
  getTitleByOrder,
} from "@skylark-reference-apps/lib";
import {
  getImageSrcAndSizeByWindow,
  Skeleton,
  CarouselItem,
} from "@skylark-reference-apps/react";

import { useSingleObject } from "../hooks/useSingleObject";
import { useSlider } from "../hooks/useSlider";

const Data: FC<{
  children(data: AllEntertainment): ReactNode;
  self: string;
  slug: string;
  isPortrait: boolean;
}> = ({ children, self, slug, isPortrait }) => {
  const { data, isLoading } = useSingleObject(
    convertUrlToObjectType(self),
    slug
  );

  return !isLoading && data ? (
    <>{children(data)}</>
  ) : (
    <Skeleton isPortrait={isPortrait} show />
  );
};

export const DataFetcher: FC<{
  children(data: AllEntertainment): ReactNode;
  self: string;
  slug: string;
  isPortrait?: boolean;
}> = (props) => {
  const { children, self, slug, isPortrait = false } = props;
  const { ref, inView } = useInView({ triggerOnce: true });

  if (!self || !slug) return <></>;

  return (
    <div ref={ref}>
      {inView ? (
        <Data isPortrait={isPortrait} self={self} slug={slug}>
          {children}
        </Data>
      ) : (
        <Skeleton isPortrait={isPortrait} show />
      )}
    </div>
  );
};

export const SliderDataFetcher: FC<{
  children(data: CarouselItem[]): ReactNode;
  self: string;
}> = (props) => {
  const { children, self } = props;
  const { ref, inView } = useInView({ triggerOnce: true });

  const { slider, isLoading } = useSlider(self);

  if (!self) return <></>;

  const items =
    !isLoading && slider?.items?.isExpanded ? slider.items.objects : [];

  return (
    <div className="h-full w-full" ref={ref}>
      {inView ? (
        <>
          {!isLoading &&
            slider &&
            children(
              items.map((carouselItem) => ({
                uid: carouselItem.uid,
                title: getTitleByOrder(
                  carouselItem.title,
                  ["medium", "short"],
                  carouselItem.objectTitle
                ),
                href:
                  carouselItem.type && carouselItem.slug
                    ? `/${carouselItem.type}/${carouselItem.slug}`
                    : "",
                image: getImageSrcAndSizeByWindow(carouselItem.images, "Main"),
                type: carouselItem.type as EntertainmentType,
                releaseDate: carouselItem.releaseDate,
              }))
            )}
        </>
      ) : (
        <Skeleton show />
      )}
    </div>
  );
};
