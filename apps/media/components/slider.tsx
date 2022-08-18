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

import { useSetBySlug } from "../hooks/useSetBySlug";

export const Slider: FC<{
  item: AllEntertainment;
  index: number;
  key: string;
}> = ({ item, index, key }) => {
  const { set, isLoading } = useSetBySlug(item?.slug);

  const { query } = useRouter();

  const activeCarouselItem = query?.carousel_item
    ? parseInt(query.carousel_item as string, 10)
    : undefined;

  const items = set?.items?.isExpanded ? set.items.objects : [];

  return (
    // If the carousel is the first item, add negative margin to make it appear through the navigation
    <div
      className={`h-[90vh] w-full md:h-[95vh] ${index === 0 ? "-mt-48" : ""}`}
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
