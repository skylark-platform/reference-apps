import { ReactNode } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import {
  MoviesPageParsedMovie,
  CollectionPage,
} from "@skylark-reference-apps/react";
import { GraphQLMediaObjectTypes } from "@skylark-reference-apps/lib";

import { useCollection } from "../../hooks/useCollection";
import {
  Brand,
  CurationMetadata,
  Entertainment,
  Episode,
  Movie,
  Season,
} from "../../types/gql";
import { MediaObjectFetcher } from "../../components/mediaObjectFetcher";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";
import {
  getFirstRatingValue,
  getGraphQLImageSrc,
  getSynopsisByOrderForGraphQLObject,
  getTitleByOrderForGraphQLObject,
} from "../../lib/utils";

const CurationMetadataFetcher: React.FC<{
  uid: string;
  children(data: MoviesPageParsedMovie): ReactNode;
  type: GraphQLMediaObjectTypes;
}> = ({ uid, children, type }) => (
  <MediaObjectFetcher type={type} uid={uid}>
    {(item: CurationMetadata & Entertainment) => (
      <>
        {children({
          title: getTitleByOrderForGraphQLObject(item, ["short", "medium"]),
          image: getGraphQLImageSrc(item?.images, "Thumbnail"),
          uid: item.uid,
          href: `/movie/${item.uid}`,
          releaseDate: item.release_date || "",
          duration: "1hr 38m",
        })}
      </>
    )}
  </MediaObjectFetcher>
);

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

  const { collection, isError } = useCollection(query?.slug as string);

  if (isError && !collection) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching collection: ${(query?.slug as string) || ""}`}</p>
        <p>{isError?.message}</p>
      </div>
    );
  }

  const title = collection ? getTitleByOrderForGraphQLObject(collection) : "";
  const synopsis = collection
    ? getSynopsisByOrderForGraphQLObject(collection)
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
          bgImage={getGraphQLImageSrc(collection?.images, "Main")}
          content={
            collection?.content?.objects?.map((item) => ({
              self: "",
              slug: "",
              uid: item?.object?.uid || "",
              type:
                // eslint-disable-next-line no-underscore-dangle
                (item?.object as Episode | Movie | Brand | Season).__typename,
            })) || []
          }
          loading={!collection}
          rating={getFirstRatingValue(collection?.ratings)}
          releaseDate={collection?.release_date || ""}
          synopsis={synopsis}
          title={title ?? ""}
        />
      )}
    </>
  );
};

export default Collection;
