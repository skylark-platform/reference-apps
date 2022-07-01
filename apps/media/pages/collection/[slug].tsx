import type { NextPage } from "next";
import Head from "next/head";
import {
  Header,
  StandardThumbnail,
  Hero,
  Skeleton,
} from "@skylark-reference-apps/react";
import {
  formatYear,
  getImageSrc,
  getTitleByOrder,
  getSynopsisByOrder,
  getImageSrcAndSizeByWindow,
} from "@skylark-reference-apps/lib";

import { useRouter } from "next/router";

import { useCollectionBySlug } from "../../hooks/useCollectionBySlug";

const CollectionPage: NextPage = () => {
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
      <Head>
        <title>{`${titleLongToShort || "Collection page"} - StreamTV`}</title>
      </Head>
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
            releaseDate={""}
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
