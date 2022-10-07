import { ReactNode } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import {
  BrandPageParsedEpisode,
  MoviesPageParsedMovie,
  CollectionPage,
} from "@skylark-reference-apps/react";
import {
  getTitleByOrder,
  getSynopsisByOrder,
} from "@skylark-reference-apps/lib";

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

/*
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
*/

const Collection: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();

  const { items: collection, isError } = useCollection();

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching brand: ${(query?.slug as string) || ""}`}</p>
        <p>{isError?.message}</p>
      </div>
    );
  }

  console.log("collection", collection);
  /*
  const title = getTitleByOrder({
    short: collection?.title_short || "",
    medium: collection?.title_medium || "",
    long: collection?.title_long || "",
  });

  const synopsis = getSynopsisByOrder({
    short: collection?.synopsis_short || "",
    medium: collection?.synopsis_medium || "",
    long: collection?.synopsis_long || "",
  });
*/
  return (
    <>
      {collection && (
        <CollectionPage
          CollectionItemDataFetcher={CurationMetadataFetcher}
          bgImage={""}
          content={
            collection?.map((item) => ({
              self: "",
              slug: "",
              uid: item?.uid || "",
            })) || []
          }
          loading={!collection}
          rating={""}
          // releaseDate={"collection?.releaseDate"}
          synopsis={"getSynopsisByOrder(collection?.synopsis)"}
          title={"title"}
        />
      )}
    </>
  );
};

export default Collection;
