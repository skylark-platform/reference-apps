import { FC } from "react";
import { useRouter } from "next/router";

import {
  Carousel,
  getImageSrcAndSizeByWindow,
  Skeleton,
} from "@skylark-reference-apps/react";
import {
  EntertainmentType,
  getTitleByOrder,
  AllEntertainment,
} from "@skylark-reference-apps/lib";

import { useSlider } from "../hooks/useSlider";

export const Slider: FC<{
  item: AllEntertainment;
  isFirstOnPage: boolean;
  key: string;
}> = ({ item, isFirstOnPage, key }) => {
  const { slider, isLoading } = useSlider(item?.slug);

  const { query } = useRouter();

  const activeCarouselItem = query?.carousel_item
    ? parseInt(query.carousel_item as string, 10)
    : undefined;

  const items = slider?.items?.isExpanded ? slider.items.objects : [];

  return (
    // If the carousel is the first item, add negative margin to make it appear through the navigation
    <div
      className={`h-[90vh] w-full md:h-[95vh] ${isFirstOnPage ? "-mt-48" : ""}`}
      key={key}
    >
      <Skeleton show={isLoading}>
        <Carousel
          activeItem={activeCarouselItem}
          changeInterval={8}
          items={items.map((carouselItem) => ({
            uid: carouselItem.uid || "",
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
          }))}
        />
      </Skeleton>
    </div>
  );
};
