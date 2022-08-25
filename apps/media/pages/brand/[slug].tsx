import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  Header,
  CallToAction,
  Hero,
  getImageSrcAndSizeByWindow,
  SkeletonPage,
  Rail,
  EpisodeThumbnail,
} from "@skylark-reference-apps/react";
import {
  Episode,
  formatReleaseDate,
  getTitleByOrder,
  getSynopsisByOrder,
  Season,
  getImageSrc,
} from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { useBrandWithSeasonBySlug } from "../../hooks/useBrandWithSeasonBySlug";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";

import { DataFetcher } from "../../components/dataFetcher";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject("brand", context.query.slug as string);
  return {
    props: {
      seo,
    },
  };
};

const sortEpisodesByNumber = (a: Episode, b: Episode) =>
  (a.number || 0) > (b.number || 0) ? 1 : -1;

const BrandPage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
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
    <div className="mb-20 mt-48 flex min-h-screen w-full flex-col items-center bg-gray-900">
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={titleShortToLong || seo.title}
      />
      <SkeletonPage show={!brand && !error}>
        <div className="-mt-48 w-full">
          <Hero bgImage={getImageSrcAndSizeByWindow(brand?.images, "Main")}>
            <div className="flex w-full flex-col">
              <Header
                description={getSynopsisByOrder(brand?.synopsis, [
                  "long",
                  "medium",
                  "short",
                ])}
                numberOfItems={seasons.length}
                rating={
                  brand?.ratings?.isExpanded
                    ? brand.ratings.items?.[0]?.title
                    : ""
                }
                releaseDate={formatReleaseDate(seasons?.[0]?.releaseDate)}
                title={getTitleByOrder(
                  brand?.title,
                  ["long", "medium", "short"],
                  brand?.objectTitle
                )}
                typeOfItems="Seasons"
              />
              {firstEpisodeOfFirstSeason && (
                <CallToAction
                  episodeNumber={firstEpisodeOfFirstSeason.number || 1}
                  episodeTitle={
                    seasons.length && seasons[0].items?.isExpanded
                      ? getTitleByOrder(seasons[0].items?.objects[0]?.title, [
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
                  seasonNumber={seasons[0].number || 1}
                />
              )}
            </div>
          </Hero>
        </div>

        {notFound && <p>{`Brand ${query?.slug as string} not found`}</p>}
        {error && !notFound && (
          <p>{`Error fetching brand: ${error.message}`}</p>
        )}

        {brand &&
          brand.items?.isExpanded &&
          seasons.map(
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
                          <DataFetcher
                            key={`episode-${ep.slug}`}
                            self={ep.self}
                            slug={ep.slug}
                          >
                            {(episode: Episode) => (
                              <EpisodeThumbnail
                                backgroundImage={getImageSrc(
                                  episode.images,
                                  "Thumbnail",
                                  "250x250"
                                )}
                                description={getSynopsisByOrder(
                                  episode?.synopsis,
                                  ["medium", "short"]
                                )}
                                href={`/episode/${episode.slug}`}
                                key={episode.objectTitle}
                                number={episode.number || 0}
                                title={getTitleByOrder(
                                  episode?.title,
                                  ["short", "medium"],
                                  episode.objectTitle
                                )}
                              />
                            )}
                          </DataFetcher>
                        ))}
                  </Rail>
                </div>
              )
          )}
      </SkeletonPage>
    </div>
  );
};

export default BrandPage;
