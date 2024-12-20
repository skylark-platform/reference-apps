import type { NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { Brand, ImageType, Season } from "../../types/gql";
import {
  SeoObjectData,
  convertObjectImagesToSeoImages,
} from "../../lib/getPageSeoData";
import {
  getGraphQLImageSrc,
  getSynopsisByOrderForGraphQLObject,
  getTitleByOrderForGraphQLObject,
} from "../../lib/utils";
import { DisplayError } from "../../components/displayError";
import { useObject } from "../../hooks/useObject";
import { GET_BRAND } from "../../graphql/queries";
import { SeasonRail } from "../../components/rails";
import {
  SkylarkTVAdditionalFields,
  SkylarkTVSupportedImageType,
} from "../../types";
import { useSkylarkEnvironment } from "../../hooks/useSkylarkEnvironment";
import { CallToAction } from "../../components/generic/call-to-action";
import { Header } from "../../components/generic/header";
import { Hero } from "../../components/generic/hero";
import { SkeletonPage } from "../../components/generic/skeleton";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const seo = await getSeoDataForObject(
//     "Brand",
//     context.query.slug as string,
//     context.locale || "",
//   );

//   return {
//     props: {
//       seo,
//     },
//   };
// };

const BrandPage: NextPage<{ seo?: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();
  const { environment, isLoading: isLoadingEnvironment } =
    useSkylarkEnvironment();

  const {
    data: brand,
    isError,
    isLoading,
  } = useObject<Brand>(
    GET_BRAND(environment?.hasUpdatedSeason),
    query?.slug as string,
    { disabled: isLoadingEnvironment },
  );

  const { t } = useTranslation("common");

  if (!isLoading && isError) {
    return (
      <DisplayError
        error={isError}
        notFoundMessage={`Brand "${query?.slug as string}" not found.`}
      />
    );
  }

  const title = getTitleByOrderForGraphQLObject(brand);
  const synopsis = getSynopsisByOrderForGraphQLObject(brand);

  const seasons = (brand?.seasons?.objects as Season[]) || [];

  const firstEpisodeOfFirstSeason =
    seasons.length > 0 && seasons?.[0].episodes?.objects?.[0];

  return (
    <div className="mb-20 mt-48 flex min-h-screen w-full flex-col items-center bg-gray-900 font-body">
      <NextSeo
        description={synopsis || seo?.synopsis || ""}
        openGraph={{
          images:
            convertObjectImagesToSeoImages(brand?.images) || seo?.images || [],
        }}
        title={title || seo?.title || "Brand"}
      />
      <SkeletonPage show={isLoading}>
        <div className="-mt-48 w-full">
          <Hero bgImage={getGraphQLImageSrc(brand?.images, ImageType.Main)}>
            <div className="flex w-full flex-col">
              <Header
                description={synopsis}
                numberOfItems={seasons.length}
                rating={
                  brand?.ratings?.objects?.[0]?.value as string | undefined
                }
                tags={brand?.tags?.objects?.map((tag) => tag?.name || "") || []}
                title={title}
                typeOfItems="season"
              />
              {firstEpisodeOfFirstSeason && (
                <CallToAction
                  episodeNumber={firstEpisodeOfFirstSeason.episode_number || 1}
                  episodeTitle={
                    firstEpisodeOfFirstSeason.title ||
                    firstEpisodeOfFirstSeason.title_short ||
                    undefined
                  }
                  href={
                    firstEpisodeOfFirstSeason
                      ? `/episode/${
                          firstEpisodeOfFirstSeason.slug ||
                          firstEpisodeOfFirstSeason.uid
                        }`
                      : ""
                  }
                  inProgress={false}
                  seasonNumber={seasons[0].season_number || 1}
                />
              )}
            </div>
          </Hero>
        </div>

        {seasons.map((season) => {
          // preferred_image_type is a field that would only be added if the SkylarkTV ingest has been run
          // So we add it manually to ensure that the codegen doesn't affect SkylarkTV's without the ingest
          // Field added in packages/ingestor/src/lib/skylark/saas/schema.ts
          const preferredImageType = (
            season as {
              [SkylarkTVAdditionalFields.PreferredImageType]?: SkylarkTVSupportedImageType;
            }
          )?.[SkylarkTVAdditionalFields.PreferredImageType];

          return (
            <SeasonRail
              className="my-6"
              header={
                season.title_short ||
                `${t("skylark.object.season")} ${season.season_number || "-"}`
              }
              key={season.uid}
              preferredImageType={preferredImageType}
              season={season}
            />
          );
        })}
      </SkeletonPage>
    </div>
  );
};

export default BrandPage;
