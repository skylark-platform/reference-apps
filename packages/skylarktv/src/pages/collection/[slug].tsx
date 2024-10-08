import type { NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

import useTranslation from "next-translate/useTranslation";
import {
  ImageType,
  SetContent,
  ObjectTypes,
  SkylarkSet,
} from "../../types/gql";
import {
  SeoObjectData,
  convertObjectImagesToSeoImages,
} from "../../lib/getPageSeoData";
import {
  formatReleaseDate,
  getFirstRatingValue,
  getGraphQLImageSrc,
  getSynopsisByOrderForGraphQLObject,
  getTitleByOrderForGraphQLObject,
} from "../../lib/utils";
import { DisplayError } from "../../components/displayError";
import { Entertainment } from "../../types";
import { ThumbnailWithSelfFetch } from "../../components/thumbnail";
import { useObject } from "../../hooks/useObject";
import { GET_COLLECTION_SET } from "../../graphql/queries";
import { SkeletonPage } from "../../components/generic/skeleton";
import { Hero } from "../../components/generic/hero";
import { Header } from "../../components/generic/header";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const seo = await getSeoDataForObject(
//     "SkylarkSet",
//     context.query.slug as string,
//     context.locale || "",
//   );
//   return {
//     props: {
//       seo,
//     },
//   };
// };

const Collection: NextPage<{ seo?: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();
  const { lang } = useTranslation("common");

  const {
    data: collection,
    isError,
    isLoading,
  } = useObject<SkylarkSet>(GET_COLLECTION_SET, query?.slug as string);

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
    <div className="mb-20 mt-48 flex min-h-screen w-full flex-col items-center bg-gray-900 font-body">
      <NextSeo
        description={synopsis || seo?.synopsis || ""}
        openGraph={{
          images:
            convertObjectImagesToSeoImages(collection?.images) ||
            seo?.images ||
            [],
        }}
        title={title || seo?.title || "Collection"}
      />
      <SkeletonPage show={isLoading}>
        <div className="-mt-48"></div>
        <Hero bgImage={getGraphQLImageSrc(collection?.images, ImageType.Main)}>
          <Header
            description={synopsis}
            numberOfItems={collection?.content?.objects?.length || 0}
            rating={getFirstRatingValue(collection?.ratings)}
            releaseDate={
              collection?.release_date
                ? formatReleaseDate(collection.release_date, lang)
                : undefined
            }
            title={title}
            typeOfItems="movie"
          />
        </Hero>
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6 px-gutter sm:px-sm-gutter md:grid-cols-3 lg:grid-cols-4 lg:px-lg-gutter xl:px-xl-gutter 2xl:grid-cols-6">
          {(collection?.content?.objects as SetContent[])?.map((content) => {
            const object = content.object as Entertainment;
            return (
              <ThumbnailWithSelfFetch
                key={object.uid}
                objectType={object.__typename as ObjectTypes}
                slug={object.slug}
                uid={object.uid}
                variant="landscape-synopsis"
              />
            );
          })}
        </div>
      </SkeletonPage>
    </div>
  );
};

export default Collection;
