import { ReactNode } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import {
  getImageSrcAndSizeByWindow,
  BrandPageParsedEpisode,
  TVShowBrandPage,
} from "@skylark-reference-apps/react";
import {
  Episode,
  getTitleByOrder,
  getSynopsisByOrder,
  Season,
  getImageSrc,
} from "@skylark-reference-apps/lib";
import { useBrandWithSeasonBySlug } from "../../hooks/useBrandWithSeasonBySlug";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";

import { DataFetcher } from "../../components/dataFetcher";

const EpisodeDataFetcher: React.FC<{
  slug: string;
  self: string;
  children(data: BrandPageParsedEpisode): ReactNode;
}> = ({ slug, self, children }) => (
  <DataFetcher self={self} slug={slug}>
    {(episode: Episode) => (
      <>
        {children({
          title: getTitleByOrder(
            episode?.title,
            ["short", "medium"],
            episode.objectTitle
          ),
          synopsis: getSynopsisByOrder(episode?.synopsis, ["medium", "short"]),
          image: getImageSrc(episode.images, "Thumbnail", "384x216"),
          number: episode?.number,
          uid: episode.uid,
          href: `/episode/${episode.slug}`,
        })}
      </>
    )}
  </DataFetcher>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject(
    "brand",
    context.query.slug as string,
    context.locale || ""
  );
  return {
    props: {
      seo,
    },
  };
};

const BrandPage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();

  const { brand, error } = useBrandWithSeasonBySlug(query?.slug as string);

  const brandObjects = brand?.items?.isExpanded ? brand.items.objects : [];
  const seasons = (brandObjects as Season[])
    .filter((item) => item.isExpanded && item.type === "season")
    .sort((a: Season, b: Season) =>
      (a.number || 0) > (b.number || 0) ? 1 : -1
    );

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching brand: ${(query?.slug as string) || ""}`}</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  const title = getTitleByOrder(
    brand?.title,
    ["long", "medium", "short"],
    brand?.objectTitle
  );

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={title || seo.title}
      />
      <TVShowBrandPage
        EpisodeDataFetcher={EpisodeDataFetcher}
        bgImage={getImageSrcAndSizeByWindow(brand?.images, "Main")}
        loading={!brand}
        rating={
          brand?.ratings?.isExpanded ? brand.ratings.items?.[0]?.title : ""
        }
        seasons={seasons.map(({ number, items }) => ({
          number,
          episodes: items?.isExpanded
            ? items.objects.map((ep) => ({
                uid: ep.uid,
                self: ep.self,
                slug: ep.slug,
                number: (ep as Episode).number,
                title: ep.objectTitle,
              }))
            : [],
        }))}
        synopsis={getSynopsisByOrder(brand?.synopsis, [
          "long",
          "medium",
          "short",
        ])}
        tags={
          brand?.tags?.isExpanded
            ? brand.tags.items.map(({ name }) => name)
            : []
        }
        title={title}
      />
    </>
  );
};

export default BrandPage;
