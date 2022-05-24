import type { NextPage } from "next";
import Head from "next/head";
import { EpisodeThumbnail, Rail, List } from "@skylark-reference-apps/react";
import {
  Episode,
  getImageSrc,
  getTitleByOrder,
  Season,
} from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { useBrandWithSeasonBySlug } from "../../hooks/useBrandWithSeasonBySlug";

const BrandPage: NextPage = () => {
  const { query } = useRouter();

  const { brand, notFound, error } = useBrandWithSeasonBySlug(
    query?.slug as string
  );

  const brandObjects = brand?.items?.isExpanded ? brand.items.objects : [];
  const seasons = (brandObjects as Season[])
    .filter((item) => item.isExpanded && item.type === "season")
    .sort((a: Season, b: Season) =>
      (a.number || 0) > (b.number || 0) ? 1 : -1
    );

  const titleShortToLong = getTitleByOrder(
    brand?.title,
    ["short", "medium", "long"],
    brand?.objectTitle
  );

  const imageSize =
    typeof window !== "undefined" &&
    (window.innerHeight > window.innerWidth
      ? `${window.innerHeight}x${window.innerHeight}`
      : `${window.innerWidth}x${window.innerWidth}`);

  const heroImage = getImageSrc(brand?.images, "Main", imageSize || "");

  return (
    <div className="mb-20 flex min-h-screen flex-col items-center bg-gray-900">
      <Head>
        <title>{`${titleShortToLong || "Brand page"} - StreamTV`}</title>
      </Head>

      <div
        className="h-[90vh] w-full md:h-[95vh]"
        style={{
          backgroundImage: `url('${heroImage}')`,
        }}
      >
        <div
          className={`
          flex h-full w-full flex-row items-end justify-between bg-gradient-to-t from-gray-900
          to-gray-900/5 px-sm-gutter pb-5
          md:pb-20 md:pr-0 md:pl-md-gutter lg:pl-lg-gutter xl:pl-xl-gutter
        `}
        >
          <div className="flex flex-col">
            <h1 className="text-6xl text-white">
              {getTitleByOrder(
                brand?.title,
                ["long", "medium", "short"],
                brand?.objectTitle
              )}
            </h1>
            <List
              contents={[
                seasons.length,
                seasons?.[0]?.year,
                brand?.ratings?.isExpanded
                  ? brand.ratings.items?.[0].title
                  : "",
              ]}
              textSize="lg"
            />
          </div>
        </div>
        {/* Use Carousel until brand components are ready */}
        {/* <Carousel
          items={[
            {
              href: "",
              title: "",
              type: "brand",
              releaseDate: "",
              image: brand?.images
                ? ((brand.images as ImageUrl[]).find(
                    (image) => image.isExpanded && image.type === "Main"
                  )?.url as string)
                : "",
            },
          ]}
        /> */}
      </div>

      {!brand && !error && <p>{`Loading ${query?.slug as string}`}</p>}
      {notFound && <p>{`Brand ${query?.slug as string} not found`}</p>}
      {error && !notFound && <p>{`Error fetching brand: ${error.message}`}</p>}

      {brand &&
        brand.items?.isExpanded &&
        (brand.items.objects as Season[]).map(
          (season) =>
            season.isExpanded &&
            season.type === "season" && (
              <div
                className="my-6 w-full"
                key={season.number || season.objectTitle || season.slug}
              >
                <Rail displayCount header={`Season ${season.number || "-"}`}>
                  {season.items?.isExpanded &&
                    (season.items.objects as Episode[])
                      .filter((ep) => ep.isExpanded && ep.type === "episode")
                      .sort((a: Episode, b: Episode) =>
                        (a.number || 0) > (b.number || 0) ? 1 : -1
                      )
                      .map((ep: Episode) => (
                        <EpisodeThumbnail
                          backgroundImage={getImageSrc(
                            ep.images,
                            "Thumbnail",
                            "250x250"
                          )}
                          description={
                            ep.synopsis?.medium || ep.synopsis?.short || ""
                          }
                          href={`/episode/${ep.slug}`}
                          key={ep.objectTitle}
                          number={ep.number || 0}
                          title={getTitleByOrder(
                            ep?.title,
                            ["short", "medium"],
                            ep.objectTitle
                          )}
                        />
                      ))}
                </Rail>
              </div>
            )
        )}
    </div>
  );
};

export default BrandPage;
