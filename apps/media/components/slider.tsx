import { FC } from "react";
import { useRouter } from "next/router";

import {
  Carousel,
  getImageSrcAndSizeByWindow,
} from "@skylark-reference-apps/react";
import {
  EntertainmentType,
  getTitleByOrder,
  AllEntertainment,
} from "@skylark-reference-apps/lib";

export const Slider: FC<{
  item: AllEntertainment;
  index: number;
  key: string;
}> = ({ item, index, key }) => {
  const { query } = useRouter();

  const activeCarouselItem = query?.carousel_item
    ? parseInt(query.carousel_item as string, 10)
    : undefined;

  const items = item?.items?.isExpanded ? item.items.objects : [];

  return (
    // If the carousel is the first item, add negative margin to make it appear through the navigation
    <div
      className={`h-[90vh] w-full md:h-[95vh] ${index === 0 ? "-mt-48" : ""}`}
      key={key}
    >
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
    </div>
  );
};
