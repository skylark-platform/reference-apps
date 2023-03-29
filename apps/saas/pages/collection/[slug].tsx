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
  ImageType,
  Episode,
  Movie,
  Season,
  SkylarkSet,
} from "../../types/gql";
import { MediaObjectFetcher } from "../../components/mediaObjectFetcher";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";
import {
  convertGraphQLSetType,
  convertTypenameToEntertainmentType,
  getFirstRatingValue,
  getGraphQLImageSrc,
  getSynopsisByOrderForGraphQLObject,
  getTitleByOrderForGraphQLObject,
} from "../../lib/utils";
import { DisplayError } from "../../components/displayError";

const CollectionItemDataFetcher: React.FC<{
  uid: string;
  children(data: MoviesPageParsedMovie): ReactNode;
  type: GraphQLMediaObjectTypes;
}> = ({ uid, children, type }) => (
  <MediaObjectFetcher type={type} uid={uid}>
    {(item: Episode | Movie | Brand | Season | SkylarkSet) => (
      <>
        {children({
          title: getTitleByOrderForGraphQLObject(item, ["short", "medium"]),
          image: getGraphQLImageSrc(item?.images, ImageType.Thumbnail),
          uid: item.uid,
          href: `/${
            item.__typename === "SkylarkSet"
              ? convertGraphQLSetType(item?.type || "")
              : convertTypenameToEntertainmentType(item.__typename)
          }/${item.uid}`,
          releaseDate: item.release_date as string | undefined,
          duration: "1hr 38m",
        })}
      </>
    )}
  </MediaObjectFetcher>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject(
    "SkylarkSet",
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

  if (!isLoading && isError) {
    return (
      <DisplayError
        error={isError}
        notFoundMessage={`Collection "${query?.slug as string}" not found.`}
      />
    );
  }

  const title = getTitleByOrderForGraphQLObject(collection);
  const synopsis = getSynopsisByOrderForGraphQLObject(collection);

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={title || seo.title}
      />
      <CollectionPage
        CollectionItemDataFetcher={CollectionItemDataFetcher}
        bgImage={getGraphQLImageSrc(collection?.images, ImageType.Main)}
        content={
          collection?.content?.objects?.map((item) => ({
            self: "",
            slug: "",
            uid: item?.object?.uid || "",
            type:
              (item?.object as Episode | Movie | Brand | Season).__typename ||
              "",
          })) || []
        }
        loading={isLoading}
        rating={getFirstRatingValue(collection?.ratings)}
        releaseDate={collection?.release_date || ""}
        synopsis={synopsis}
        title={title}
      />
    </>
  );
};

export default Collection;
