import { ObjectTypes } from "@skylark-reference-apps/lib";
import React from "react";
import {
  Carousel,
  CarouselItem,
  CollectionThumbnail,
  EpisodeThumbnail,
  MovieThumbnail,
  Rail,
  SkeletonPage,
} from "../../components";

export interface HomePageParsedRailItem {
  image: string;
  href: string;
  uid: string;
  title: string;
  synopsis: string;
  slug: string;
  number: number;
}

interface Props {
  loading?: boolean;
  items: {
    uid: string;
    type: ObjectTypes;
    slug: string;
    self: string;
    title: string;
    content: {
      slug: string;
      self: string;
    }[];
  }[];
  RailItemDataFetcher: React.FC<{
    slug: string;
    self: string;
    isPortrait: boolean;
    children(data: HomePageParsedRailItem): React.ReactNode;
  }>;
  SliderDataFetcher: React.FC<{
    self: string;
    children(data: CarouselItem[]): React.ReactNode;
  }>;
}

export const HomePage: React.FC<Props> = ({
  loading,
  items,
  RailItemDataFetcher,
  SliderDataFetcher,
}) => (
  <div className="mb-20 mt-48 flex min-h-screen flex-col items-center bg-gray-900 font-body">
    <SkeletonPage show={!!loading}>
      {items.map((item, index) => {
        if (item.type === "slider") {
          return (
            <SliderDataFetcher key={item.uid} self={item.self}>
              {(sliderItems) => (
                // If the carousel is the first item, add negative margin to make it appear through the navigation
                <div
                  className={`h-[90vh] w-full md:h-[95vh] ${
                    index === 0 ? "-mt-48" : ""
                  }`}
                >
                  <Carousel changeInterval={8} items={sliderItems} />
                </div>
              )}
            </SliderDataFetcher>
          );
        }

        return (
          <div className="my-6 w-full" key={item.uid}>
            <Rail displayCount header={item.title}>
              {item.content.map(({ self, slug }) => (
                <RailItemDataFetcher
                  isPortrait={(["collection"] as ObjectTypes[]).includes(
                    item.type
                  )}
                  key={`thumbnail-${slug}`}
                  self={self}
                  slug={slug}
                >
                  {({ image, href, uid, title, synopsis, number }) => {
                    switch (item.type) {
                      case "collection":
                        return (
                          <CollectionThumbnail
                            backgroundImage={image}
                            contentLocation="below"
                            href={href}
                            key={uid}
                            title={title}
                          />
                        );
                      case "season":
                        return (
                          <EpisodeThumbnail
                            backgroundImage={image}
                            contentLocation="below"
                            description={synopsis}
                            href={href}
                            key={uid}
                            number={number}
                            title={title}
                          />
                        );
                      default:
                        return (
                          <MovieThumbnail
                            backgroundImage={image}
                            contentLocation="below"
                            href={href}
                            key={uid}
                            title={title}
                          />
                        );
                    }
                  }}
                </RailItemDataFetcher>
              ))}
            </Rail>
          </div>
        );
      })}
    </SkeletonPage>
  </div>
);
