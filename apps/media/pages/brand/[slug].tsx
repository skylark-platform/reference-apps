import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  Header,
  CallToAction,
  Hero,
  getImageSrcAndSizeByWindow,
  SkeletonPage,
} from "@skylark-reference-apps/react";
import {
  Episode,
  formatReleaseDate,
  getTitleByOrder,
  getSynopsisByOrder,
  Season,
} from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { useBrandWithSeasonBySlug } from "../../hooks/useBrandWithSeasonBySlug";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";

import { SeasonRail } from "../../components/seasonRail";

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
    <div className="mb-20 mt-48 flex min-h-screen flex-col items-center bg-gray-900">
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={titleShortToLong || seo.title}
      />
      <SkeletonPage show={!brand && !error}>
        <div className="-mt-48">
          <Hero bgImage={getImageSrcAndSizeByWindow(brand?.images, "Main")}>
            <div className="flex flex-col">
              <Header
                description={getSynopsisByOrder(brand?.synopsis, [
                  "long",
                  "medium",
                  "short",
                ])}
                numberOfItems={seasons.length}
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
                typeOfItems="Seasons"
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
          seasons.map(
            (season) =>
              season.isExpanded &&
              season.type === "season" && (
                <div
                  className="my-6 w-full"
                  key={season.number || season.objectTitle || season.slug}
                >
                  <SeasonRail
                    episodeDescription={["medium", "short"]}
                    episodeTitle={["short", "medium"]}
                    header={`Season ${season.number || "-"}`}
                    item={season}
                    thumbnailSize="250x250"
                  />
                </div>
              )
          )}
      </SkeletonPage>
    </div>
  );
};

export default BrandPage;
