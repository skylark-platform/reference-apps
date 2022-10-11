import { ReactNode } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import {
  MoviesPageParsedMovie,
  CollectionPage,
} from "@skylark-reference-apps/react";
import { GraphQLMediaObjectTypes } from "@skylark-reference-apps/lib";

import { useCollection } from "../../hooks/useCollection";
import { Brand, Set, ImageType, Episode, Movie, Season } from "../../types/gql";
import { MediaObjectFetcher } from "../../components/mediaObjectFetcher";
import { SeoObjectData } from "../../lib/getPageSeoData";
import {
  convertGraphQLSetType,
  convertTypenameToEntertainmentType,
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
    {(item: Episode | Movie | Brand | Season | Set) => (
      <>
        {children({
          title: getTitleByOrderForGraphQLObject(item, ["short", "medium"]),
          image: getGraphQLImageSrc(item?.images, ImageType.Thumbnail),
          uid: item.uid,
          href: `/${
            item.__typename === "Set"
              ? convertGraphQLSetType(item?.type || "")
              : convertTypenameToEntertainmentType(item.__typename)
          }/${item.uid}`,
          releaseDate: item.release_date || "",
          duration: "1hr 38m",
        })}
      </>
    )}
  </MediaObjectFetcher>
);

const Collection: NextPage<{ seo: SeoObjectData }> = () => {
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
      {collection && (
        <CollectionPage
          CollectionItemDataFetcher={CurationMetadataFetcher}
          bgImage={getGraphQLImageSrc(collection?.images, ImageType.Main)}
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
