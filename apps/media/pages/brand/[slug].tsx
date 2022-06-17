import type { NextPage } from "next";
import Head from "next/head";
import {
  EpisodeThumbnail,
  Rail,
  BrandHeader,
  CallToAction,
  Hero,
  Skeleton,
} from "@skylark-reference-apps/react";
import {
  Episode,
  formatReleaseDate,
  getImageSrc,
  getImageSrcAndSizeByWindow,
  getTitleByOrder,
  Season,
} from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { useBrandWithSeasonBySlug } from "../../hooks/useBrandWithSeasonBySlug";

const sortEpisodesByNumber = (a: Episode, b: Episode) =>
  (a.number || 0) > (b.number || 0) ? 1 : -1;

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

  const [firstEpisodeOfFirstSeason] = seasons?.[0]?.items?.isExpanded
    ? (seasons[0].items.objects as Episode[]).sort(sortEpisodesByNumber)
    : [];

  const titleShortToLong = getTitleByOrder(
    brand?.title,
    ["short", "medium", "long"],
    brand?.objectTitle
  );

  return (
    <div className="mb-20 mt-48 flex min-h-screen flex-col items-center bg-gray-900">
      <Head>
        <title>{`${titleShortToLong || "Brand page"} - StreamTV`}</title>
      </Head>

      <Skeleton show={!brand && !error}>
        <div className="-mt-48">
          <Hero bgImage={getImageSrcAndSizeByWindow(brand?.images, "Main")}>
            <div className="flex flex-col">
              <BrandHeader
                description={
                  brand?.synopsis.long ||
                  brand?.synopsis.medium ||
                  brand?.synopsis.short
                }
                numberOfSeasons={seasons.length}
                rating={
                  brand?.ratings?.isExpanded
                    ? brand.ratings.items?.[0].title
                    : ""
                }
                releaseDate={formatReleaseDate(seasons?.[0]?.releaseDate)}
                title={getTitleByOrder(
                  brand?.title,
                  ["long", "medium", "short"],
                  brand?.objectTitle
                )}
              />
              <CallToAction
                episodeNumber={1}
                episodeTitle={
                  seasons.length && seasons[0].items?.isExpanded
                    ? getTitleByOrder(seasons[0].items?.objects[0].title, [
                        "long",
                        "medium",
                        "short",
                      ])
                    : ""
                }
                href={
                  firstEpisodeOfFirstSeason
                    ? `/${firstEpisodeOfFirstSeason.type}/${firstEpisodeOfFirstSeason.slug}`
                    : ""
                }
                inProgress={false}
                seasonNumber={1}
              />
            </div>
          </Hero>
        </div>

        {notFound && <p>{`Brand ${query?.slug as string} not found`}</p>}
        {error && !notFound && (
          <p>{`Error fetching brand: ${error.message}`}</p>
        )}

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
                        .sort(sortEpisodesByNumber)
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
      </Skeleton>
    </div>
  );
};

export default BrandPage;
