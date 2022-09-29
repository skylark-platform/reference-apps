import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  getImageSrcAndSizeByWindow,
  CollectionPage,
  CollectionPageParsedContentItem,
} from "@skylark-reference-apps/react";
import {
  getImageSrc,
  getTitleByOrder,
  getSynopsisByOrder,
} from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { useCollectionBySlug } from "../../hooks/useCollectionBySlug";
import { getSeoDataForSet, SeoObjectData } from "../../lib/getPageSeoData";
import { DataFetcher } from "../../components/dataFetcher";

const CollectionItemDataFetcher: React.FC<{
  slug: string;
  self: string;
  children(data: CollectionPageParsedContentItem): React.ReactNode;
}> = ({ children, slug, self }) => (
  <DataFetcher self={self} slug={slug}>
    {(item) => (
      <>
        {children({
          title: getTitleByOrder(
            item?.title,
            ["short", "medium"],
            item.objectTitle
          ),
          synopsis: getSynopsisByOrder(item?.synopsis, ["medium", "short"]),
          image: getImageSrc(item.images, "Thumbnail", "384x216"),
          duration: "1h 59m",
          slug: item.slug,
          uid: item.uid,
          href: item.type && item.slug ? `/${item.type}/${item.slug}` : "",
        })}
      </>
    )}
  </DataFetcher>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForSet(
    "collection",
    context.query.slug as string,
    context.locale || ""
  );
  return {
    props: {
      seo,
    },
  };
};

const Collection: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();
  const { collection, error } = useCollectionBySlug(query?.slug as string);

  const content = collection?.items?.isExpanded ? collection.items.objects : [];

  const title = getTitleByOrder(
    collection?.title,
    ["long", "medium", "short"],
    collection?.objectTitle
  );

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching collection: ${(query?.slug as string) || ""}`}</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={title || seo.title}
      />
      <CollectionPage
        CollectionItemDataFetcher={CollectionItemDataFetcher}
        bgImage={getImageSrcAndSizeByWindow(collection?.images, "Main")}
        content={content}
        loading={!collection}
        rating={
          collection?.ratings?.isExpanded
            ? collection?.ratings?.items?.[0]?.title
            : ""
        }
        releaseDate={collection?.releaseDate}
        synopsis={getSynopsisByOrder(collection?.synopsis)}
        title={title}
      />
    </>
  );
};

export default Collection;
