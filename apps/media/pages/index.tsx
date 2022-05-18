import type { NextPage } from "next";
import Head from "next/head";
import {
  Carousel,
  CollectionThumbnail,
  EpisodeThumbnail,
  MovieThumbnail,
  Rail,
} from "@skylark-reference-apps/react";
import { useRouter } from "next/router";
import {
  SKYLARK_API,
  AllEntertainment,
  CompleteApiEntertainmentObject,
  CompleteSetItem,
  ImageUrls,
  ImageUrl,
  ApiImageUrls,
  ApiImage,
  Episode,
  Movie,
  Season,
  Brand,
  SkylarkObject,
  UnexpandedSkylarkObject,
  ObjectTypes,
  Asset,
  UnexpandedImageUrl,
  EntertainmentType,
} from "@skylark-reference-apps/lib";
import useSWR from "swr";

import { collectionThumbnails } from "../test-data";

const getObjectTypeFromSelf = (self: string): ObjectTypes => {
  if (self.startsWith("/api/episode")) {
    return "episode";
  }

  if (self.startsWith("/api/movie")) {
    return "movie";
  }

  if (self.startsWith("/api/brand")) {
    return "brand";
  }

  if (self.startsWith("/api/season")) {
    return "season";
  }

  if (self.startsWith("/api/asset")) {
    return "asset";
  }

  return null;
};

const parseSkylarkImageUrls = (imageUrls: ApiImageUrls): ImageUrls => {
  if (typeof imageUrls[0] === "string" || imageUrls[0] instanceof String) {
    const unexpandedImageUrls: UnexpandedImageUrl[] = (
      imageUrls as string[]
    ).map((item) => ({
      self: item,
      isExpanded: false,
    }));
    return unexpandedImageUrls;
  }

  const parsedImageUrls: ImageUrl[] = (imageUrls as ApiImage[]).map(
    (item: ApiImage): ImageUrl => ({
      self: item.self,
      isExpanded: true,
      url: item.url,
      urlPath: item.url_path,
      type: item.image_type,
    })
  );

  return parsedImageUrls;
};

const parseSkylarkObject = (
  obj: CompleteApiEntertainmentObject
): AllEntertainment => {
  let items;
  if (obj.items && obj.items.length > 0) {
    // If one item is a string, the items haven't been expanded
    if (typeof obj.items[0] === "string" || obj.items[0] instanceof String) {
      items = (obj.items as string[]).map(
        (self): UnexpandedSkylarkObject => ({
          isExpanded: false,
          self,
          type: getObjectTypeFromSelf(self),
        })
      );
    } else {
      const objectItems = obj.items as (
        | CompleteApiEntertainmentObject
        | CompleteSetItem
      )[];
      items = objectItems.map(
        (item): AllEntertainment => parseSkylarkObject(item.content_url || item)
      );
    }
    // console.log("items", x)
  }

  const x: AllEntertainment = {
    self: obj.self,
    isExpanded: true,
    uid: obj.uid,
    slug: obj.slug,
    objectTitle: obj.title,
    title: {
      short: obj.title_short,
      medium: obj.title_medium,
      long: obj.title_long,
    },
    synopsis: {
      short: obj.synopsis_short,
      medium: obj.synopsis_medium,
      long: obj.synopsis_long,
    },
    items,
    type: null,
    images: obj.image_urls ? parseSkylarkImageUrls(obj.image_urls) : [],
  };

  if (obj.self) {
    if (obj.self.startsWith("/api/set") && obj.set_type_slug) {
      const set: SkylarkObject = {
        ...x,
        type: obj.set_type_slug,
      };
      return set;
    }

    if (obj.self.startsWith("/api/movie")) {
      const movie: Movie = {
        ...x,
        type: "movie",
      };
      return movie;
    }

    if (obj.self.startsWith("/api/episode")) {
      const episode: Episode = {
        ...x,
        type: "episode",
        number: obj.episode_number,
      };
      return episode;
    }

    if (obj.self.startsWith("/api/season")) {
      const season: Season = {
        ...x,
        type: "season",
        number: obj.season_number,
        releaseDate: `${obj.year || ""}`,
      };
      return season;
    }

    if (obj.self.startsWith("/api/brand")) {
      const brand: Brand = {
        ...x,
        type: "brand",
      };
      return brand;
    }

    if (obj.self.startsWith("/api/asset")) {
      const asset: Asset = {
        ...x,
        type: "asset",
      };
      return asset;
    }
  }

  return x;
};

const brandBySlugFetcher = () =>
  fetch(
    `${SKYLARK_API}/api/sets/coll_30e5c34723a549d8af15e1878400a665/?fields_to_expand=items__content_url,items__content_url__items,items__content_url__items__content_url,items__content_url__items__content_url__image_urls&fields=items,items__content_url,items__short_title,items__content_url__items,items__content_url__set_type_slug,items__content_url__self,items__content_url__title_short`
  )
    .then((r) => r.json())
    .then((res: CompleteApiEntertainmentObject) => parseSkylarkObject(res));

const Home: NextPage = () => {
  const { query } = useRouter();
  const { data } = useSWR<AllEntertainment, any>("slug", brandBySlugFetcher);
  // console.log({ data })
  // if (data) console.log("parseSkylarkObject", parseSkylarkObject(data))
  console.log("data", data);

  const activeCarouselItem = query?.carousel_item
    ? parseInt(query.carousel_item as string, 10)
    : undefined;

  return (
    <div className="mb-20 flex min-h-screen flex-col items-center bg-gray-900">
      <Head>
        <title>{`Skylark Media Reference App`}</title>
      </Head>

      {data?.isExpanded &&
        data.items?.map((item) => {
          if (item.isExpanded) {
            if (item.type === "slider") {
              return (
                <div className="h-[90vh] w-full md:h-[95vh]">
                  <Carousel
                    activeItem={activeCarouselItem}
                    changeInterval={6}
                    items={(
                      item.items?.filter(
                        (carouselItem) => carouselItem.isExpanded === true
                      ) as SkylarkObject[]
                    ).map((carouselItem) => ({
                      uid: carouselItem.uid || "",
                      title:
                        carouselItem.title?.medium ||
                        carouselItem.title?.short ||
                        carouselItem.objectTitle ||
                        "",
                      slug: carouselItem.slug || "",
                      image: carouselItem.images
                        ? ((carouselItem.images as ImageUrl[]).find(
                            (image) => image.isExpanded && image.type === "Main"
                          )?.url as string)
                        : "",
                      type: carouselItem.type as EntertainmentType,
                      releaseDate: carouselItem.releaseDate || "",
                      duration: (carouselItem as Episode).duration,
                    }))}
                  />
                </div>
              );
            }

            if (item.type === "rail") {
              return (
                <div className="my-6 w-full">
                  <Rail
                    displayCount
                    header={item.title?.medium || item.title?.short}
                  >
                    {(
                      item.items?.filter(
                        (railItem) => railItem.isExpanded === true
                      ) as SkylarkObject[]
                    ).map((movie) => (
                      <MovieThumbnail
                        backgroundImage={
                          movie.images
                            ? ((movie.images as ImageUrl[]).find(
                                (image) =>
                                  image.isExpanded && image.type === "Thumbnail"
                              )?.url as string)
                            : ""
                        }
                        contentLocation="below"
                        href={movie.slug || ""}
                        key={movie.objectTitle || movie.uid || movie.slug}
                        title={movie.title?.short || ""}
                      />
                    ))}
                  </Rail>
                </div>
              );
            }

            if (item.type === "season") {
              return (
                <div className="my-6 w-full">
                  <Rail
                    displayCount
                    header={item.title?.medium || item.title?.short}
                  >
                    {(
                      item.items?.filter(
                        (railItem) => railItem.isExpanded === true
                      ) as Episode[]
                    )
                      .sort((a: Episode, b: Episode) =>
                        (a.number || 0) > (b.number || 0) ? 1 : -1
                      )
                      .map((episode) => (
                        <EpisodeThumbnail
                          backgroundImage={
                            episode.images
                              ? ((episode.images as ImageUrl[]).find(
                                  (image) =>
                                    image.isExpanded &&
                                    image.type === "Thumbnail"
                                )?.url as string)
                              : ""
                          }
                          contentLocation="below"
                          description={
                            episode.synopsis?.short ||
                            episode.synopsis?.medium ||
                            episode.synopsis?.long ||
                            ""
                          }
                          href={episode.slug || ""}
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
        <Rail displayCount header="Discover">
          {collectionThumbnails.map((collection) => (
            <CollectionThumbnail key={collection.title} {...collection} />
          ))}
        </Rail>
      </div>
    </div>
  );
};

export default Home;
