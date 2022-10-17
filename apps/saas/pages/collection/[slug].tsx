import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { CollectionPage } from "@skylark-reference-apps/react";

import { useCollection } from "../../hooks/useCollection";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";
import { getTitleByOrderForGraphQLObject } from "../../lib/utils";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject(
    "Set",
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

  const { collection, isLoading, isError } = useCollection(
    query?.slug as string
  );

  if (isError && !collection) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching collection: ${(query?.slug as string) || ""}`}</p>
        <p>{isError?.message}</p>
      </div>
    );
  }

  const title = collection ? getTitleByOrderForGraphQLObject(collection) : "";

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={title || seo.title}
      />
      <CollectionPage
        bgImage={
          "https://dl.airtable.com/.attachments/0ef915b9e5390d59aa31f0543fbc5313/e6092e13/Hero-TarantinoCollection-Mobile.jpg"
        }
        collectionItemDataFetcher={""}
        content={[]}
        loading={isLoading}
        rating={""}
        releaseDate={""}
        synopsis={""}
        title={""}
      />
    </>
  );
};

export default Collection;
