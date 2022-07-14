import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  Header,
  StandardThumbnail,
  Hero,
  Skeleton,
  getImageSrcAndSizeByWindow,
} from "@skylark-reference-apps/react";
import {
  formatYear,
  formatReleaseDate,
  getImageSrc,
  getTitleByOrder,
  getSynopsisByOrder,
} from "@skylark-reference-apps/lib";

import { useRouter } from "next/router";

import { useCollectionBySlug } from "../../hooks/useCollectionBySlug";
import { getSeoDataForSet, SeoObjectData } from "../../lib/getPageSeoData";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForSet(
    "collection",
    context.query.slug as string
  );
  return {
    props: {
      seo,
    },
  };
};

const CollectionPage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();
  const { collection, error } = useCollectionBySlug(query?.slug as string);

  const collectionObjects = collection?.items?.isExpanded
    ? collection.items.objects
    : [];

  const titleLongToShort = getTitleByOrder(
    collection?.title,
    ["long", "medium", "short"],
    collection?.objectTitle
  );

  return (
    <div className="mb-20 mt-48 flex min-h-screen flex-col items-center bg-gray-900">
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={titleLongToShort || seo.title}
      />
      <Skeleton show={!collection && !error}>
        <div className="-mt-48"></div>
        <Hero bgImage={getImageSrcAndSizeByWindow(collection?.images, "Main")}>
          <Header
            description={getSynopsisByOrder(collection?.synopsis)}
            numberOfItems={collection?.items?.objects.length || 0}
            rating={
              collection?.ratings?.isExpanded
                ? collection?.ratings?.items?.[0]?.title
                : ""
            }
            releaseDate={formatReleaseDate(collection?.releaseDate)}
            title={titleLongToShort}
            typeOfItems="Movies"
          />
        </Hero>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-gutter sm:px-sm-gutter md:grid-cols-3 lg:grid-cols-4 lg:px-lg-gutter xl:px-xl-gutter 2xl:grid-cols-6">
          {collectionObjects.map((item) => (
            <StandardThumbnail
              backgroundImage={getImageSrc(item.images, "Thumbnail", "384x216")}
              contentLocation="below"
              description={getSynopsisByOrder(item?.synopsis)}
              duration="1h 59m"
              href={item.type && item.slug ? `/${item.type}/${item.slug}` : ""}
              key={item.objectTitle || item.uid || item.slug}
              releaseDate={formatYear(item.releaseDate)}
              title={item.title?.short || ""}
            />
          ))}
        </div>
      </Skeleton>
    </div>
  );
};

export default CollectionPage;
