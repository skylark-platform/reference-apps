import type { NextPage } from "next";
import Head from "next/head";
import {
  Carousel,
  CollectionThumbnail,
  EpisodeThumbnail,
  MovieThumbnail,
  Rail,
  useAppLoaded,
} from "@skylark-reference-apps/react";
import { useRouter } from "next/router";
import {
  Episode,
  EntertainmentType,
  getImageSrc,
  Season,
  getTitleByOrder,
  getImageSrcAndSizeByWindow,
} from "@skylark-reference-apps/lib";
import { useEffect } from "react";

import { collectionThumbnails } from "../test-data";
import { useHomepageSet } from "../hooks/useHomepageSet";

const Home: NextPage = () => {
  const { query } = useRouter();
  const { homepage } = useHomepageSet();
  const { setAppLoaded } = useAppLoaded();

  // Show loading screen until homepage has loaded
  useEffect(() => {
    setAppLoaded(!!homepage);
  }, [homepage]);

  const activeCarouselItem = query?.carousel_item
    ? parseInt(query.carousel_item as string, 10)
    : undefined;

  return (
    <div className="mb-20 flex min-h-screen flex-col items-center bg-gray-900">
      <Head>
        <title>{`Home - StreamTV`}</title>
      </Head>

      {homepage?.isExpanded &&
        homepage?.items?.isExpanded &&
        homepage.items.objects.map((item) => {
          if (item.isExpanded) {
            const key = `${item.self}-${item.slug}-${item.uid}-${item.objectTitle}`;
            if (item.type === "slider") {
              return (
                <div className="h-[90vh] w-full md:h-[95vh]" key={key}>
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
                            releaseDate: (carouselItem as Season)?.year
                              ? `${(carouselItem as Season).year || ""}`
                              : "",
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

      <div className="my-6 w-full">
        <Rail
          displayCount
          header="Discover (this is hardcoded and not implemented)"
        >
          {collectionThumbnails.map((collection) => (
            <CollectionThumbnail key={collection.title} {...collection} />
          ))}
        </Rail>
      </div>
    </div>
  );
};

export default Home;
