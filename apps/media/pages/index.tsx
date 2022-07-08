import type { NextPage } from "next";
import Head from "next/head";
import {
  Carousel,
  CollectionThumbnail,
  EpisodeThumbnail,
  MovieThumbnail,
  Rail,
  getImageSrcAndSizeByWindow,
  Skeleton,
} from "@skylark-reference-apps/react";
import { useRouter } from "next/router";
import {
  Episode,
  EntertainmentType,
  getImageSrc,
  getTitleByOrder,
} from "@skylark-reference-apps/lib";

import { useHomepageSet } from "../hooks/useHomepageSet";

const Home: NextPage = () => {
  const { query } = useRouter();
  const { homepage } = useHomepageSet();

  const activeCarouselItem = query?.carousel_item
    ? parseInt(query.carousel_item as string, 10)
    : undefined;

  return (
    <div className="mb-20 mt-48 flex min-h-screen flex-col items-center bg-gray-900">
      <Head>
        <title>{`Home - StreamTV`}</title>
      </Head>

      <Skeleton show={!homepage}>
        {homepage?.isExpanded &&
          homepage?.items?.isExpanded &&
          homepage.items.objects.map((item, index) => {
            if (item.isExpanded) {
              const key = `${item.self}-${item.slug}-${item.uid}-${item.objectTitle}`;
              if (item.type === "slider") {
                return (
                  // If the carousel is the first item, add negative margin to make it appear through the navigation
                  <div
                    className={`h-[90vh] w-full md:h-[95vh] ${
                      index === 0 ? "-mt-48" : ""
                    }`}
                    key={key}
                  >
                    <Carousel
                      activeItem={activeCarouselItem}
                      changeInterval={8}
                      items={
                        item?.items?.isExpanded
                          ? item.items.objects.map((carouselItem) => ({
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
                              image: getImageSrcAndSizeByWindow(
                                carouselItem.images,
                                "Main"
                              ),
                              type: carouselItem.type as EntertainmentType,
                              releaseDate: carouselItem.releaseDate,
                            }))
                          : []
                      }
                    />
                  </div>
                );
              }

              if (item.type === "rail" && item?.items?.isExpanded) {
                return (
                  <div className="my-6 w-full" key={key}>
                    <Rail
                      displayCount
                      header={item.title?.medium || item.title?.short}
                    >
                      {item.items.objects.map((movie) => (
                        <MovieThumbnail
                          backgroundImage={getImageSrc(
                            movie.images,
                            "Thumbnail",
                            "384x216"
                          )}
                          contentLocation="below"
                          href={
                            movie.type && movie.slug
                              ? `/${movie.type}/${movie.slug}`
                              : ""
                          }
                          key={movie.objectTitle || movie.uid || movie.slug}
                          releaseDate={movie.releaseDate}
                          title={movie.title?.short || ""}
                        />
                      ))}
                    </Rail>
                  </div>
                );
              }

              if (item.type === "collection" && item?.items?.isExpanded) {
                return (
                  <div className="my-6 w-full" key={key}>
                    <Rail
                      displayCount
                      header={item.title?.medium || item.title?.short}
                    >
                      {item.items.objects.map((collectionItem) => (
                        <CollectionThumbnail
                          backgroundImage={getImageSrc(
                            collectionItem.images,
                            "Thumbnail",
                            "350x350"
                          )}
                          contentLocation="below"
                          href={
                            collectionItem.type && collectionItem.slug
                              ? `/${collectionItem.type}/${collectionItem.slug}`
                              : ""
                          }
                          key={
                            collectionItem.objectTitle ||
                            collectionItem.uid ||
                            collectionItem.slug
                          }
                          title={getTitleByOrder(collectionItem.title, [
                            "short",
                            "medium",
                          ])}
                        />
                      ))}
                    </Rail>
                  </div>
                );
              }

              if (item.type === "season" && item?.items?.isExpanded) {
                return (
                  <div className="my-6 w-full" key={key}>
                    <Rail
                      displayCount
                      header={item.title?.medium || item.title?.short}
                    >
                      {(item.items.objects as Episode[])
                        .sort((a: Episode, b: Episode) =>
                          (a.number || 0) > (b.number || 0) ? 1 : -1
                        )
                        .map((episode) => (
                          <EpisodeThumbnail
                            backgroundImage={getImageSrc(
                              episode.images,
                              "Thumbnail",
                              "384x216"
                            )}
                            contentLocation="below"
                            description={
                              episode.synopsis?.short ||
                              episode.synopsis?.medium ||
                              episode.synopsis?.long ||
                              ""
                            }
                            href={
                              episode.type && episode.slug
                                ? `/${episode.type}/${episode.slug}`
                                : ""
                            }
                            key={
                              episode.objectTitle || episode.uid || episode.slug
                            }
                            number={episode.number || 0}
                            releaseDate={episode.releaseDate}
                            title={episode.title?.short || ""}
                          />
                        ))}
                    </Rail>
                  </div>
                );
              }
            }

            return <>{item.isExpanded && item.objectTitle}</>;
          })}
      </Skeleton>
    </div>
  );
};

export default Home;
