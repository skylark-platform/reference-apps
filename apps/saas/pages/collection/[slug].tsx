import { ReactNode } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import {
  MoviesPageParsedMovie,
  CollectionPage,
} from "@skylark-reference-apps/react";

import { useCollection } from "../../hooks/useCollection";
import {
  Episode,
  Season,
  CurationMetadata,
  Entertainment,
} from "../../types/gql";
import { MediaObjectFetcher } from "../../components/mediaObjectFetcher";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";
import {
  getGraphQLImageSrc,
  getSynopsisByOrderForGraphQLObject,
  getTitleByOrderForGraphQLObject,
} from "../../lib/utils";

// TODO, same as movies ?
const CurationMetadataFetcher: React.FC<{
  uid: string;
  children(data: MoviesPageParsedMovie): ReactNode;
}> = ({ uid, children }) => (
  <MediaObjectFetcher type="Movie" uid={uid}>
    {(item: CurationMetadata & Entertainment) => (
      <>
        {children({
          title: getTitleByOrderForGraphQLObject(item, ["short", "medium"]),
          image: getGraphQLImageSrc(item?.images, "Thumbnail"),
          uid: item.uid,
          href: `/movie/${item.uid}`,
          releaseDate: "",
          duration: "1hr 38m",
        })}
      </>
    )}
  </MediaObjectFetcher>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject("Movie", context.query.slug as string);
  return {
    props: {
      seo,
    },
  };
};

const Collection: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();

  const { collection, items, isError } = useCollection();

  if (isError && !collection) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching brand: ${(query?.slug as string) || ""}`}</p>
        <p>{isError?.message}</p>
      </div>
    );
  }

  console.log("collection", items);

  const title = collection
    ? getTitleByOrderForGraphQLObject(collection[0])
    : "";
  const synopsis = collection
    ? getSynopsisByOrderForGraphQLObject(collection[0])
    : "";
  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={title || seo.title}
      />
      {collection && (
        <CollectionPage
          CollectionItemDataFetcher={CurationMetadataFetcher}
          bgImage={getGraphQLImageSrc(collection[0]?.images, "Main")}
          content={
            items?.map((item) => ({
              self: "",
              slug: "",
              uid: item?.uid || "",
            })) || []
          }
          loading={!collection}
          rating={""}
          releaseDate={""} // collection[0]?.releaseDate}
          synopsis={synopsis}
          title={title ?? ""}
        />
      )}
    </>
  );
};

export default Collection;
