import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  SeoObjectData,
  convertObjectImagesToSeoImages,
} from "../../lib/getPageSeoData";
import {
  convertObjectToName,
  getFirstRatingValue,
  getFurthestAvailabilityEndDate,
  getGraphQLImageSrc,
  getSynopsisByOrderForGraphQLObject,
  getTitleByOrderForGraphQLObject,
  splitAndFormatGraphQLCreditsByInternalTitle,
} from "../../lib/utils";
import { Availability, Episode, ImageType } from "../../types/gql";
import { DisplayError } from "../../components/displayError";
import { useObject } from "../../hooks/useObject";
import { GET_EPISODE } from "../../graphql/queries";
import { PlaybackPage } from "../../components/pages/playback";
import {
  useAddSlugToObjectUrl,
  useUidAndSlugFromObjectUrl,
} from "../../hooks/useUidAndSlugFromObjectUrl";
import { useSkylarkEnvironment } from "../../hooks/useSkylarkEnvironment";
import { CLIENT_APP_CONFIG } from "../../constants/app";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const seo = await getSeoDataForObject(
//     "Episode",
//     context.query.slug as string,
//     context.locale || "",
//   );

//   return {
//     props: {
//       seo,
//     },
//   };
// };

const EpisodePage: NextPage<{ seo?: SeoObjectData }> = ({ seo }) => {
  const { uid } = useUidAndSlugFromObjectUrl();

  const { environment, isLoading: isLoadingEnvironment } =
    useSkylarkEnvironment();

  const {
    data: episode,
    isError,
    isLoading,
  } = useObject<Episode>(
    GET_EPISODE(environment?.hasUpdatedSeason),
    uid as string,
    { disabled: isLoadingEnvironment },
  );

  const canonical = useAddSlugToObjectUrl(episode);

  if (!isLoading && isError) {
    return (
      <DisplayError
        error={isError}
        notFoundMessage={`Episode "${uid as string}" not found.`}
      />
    );
  }

  const title = getTitleByOrderForGraphQLObject(episode, [
    "title_short",
    "title",
  ]);
  const synopsis = getSynopsisByOrderForGraphQLObject(episode);

  const asset = episode?.assets?.objects?.[0];
  const playbackUrl =
    asset?.hls_url || asset?.url || CLIENT_APP_CONFIG.placeholderVideo;

  const availabilityEndDate = getFurthestAvailabilityEndDate(
    episode?.availability?.objects as Availability[] | undefined,
  );

  return (
    <>
      <NextSeo
        canonical={canonical?.url}
        description={synopsis || seo?.synopsis || ""}
        openGraph={{
          images:
            convertObjectImagesToSeoImages(episode?.images) ||
            convertObjectImagesToSeoImages(asset?.images) ||
            seo?.images ||
            [],
        }}
        title={title || seo?.title || "Episode"}
      />
      <PlaybackPage
        audienceRating={episode?.audience_rating || undefined}
        availabilityEndDate={availabilityEndDate}
        brand={
          episode?.seasons?.objects?.[0]?.brands?.objects?.[0]
            ? {
                title: getTitleByOrderForGraphQLObject(
                  episode?.seasons?.objects?.[0]?.brands?.objects?.[0],
                ),
                uid: episode?.seasons?.objects?.[0]?.brands?.objects?.[0].uid,
              }
            : undefined
        }
        credits={splitAndFormatGraphQLCreditsByInternalTitle(
          episode?.credits?.objects,
        )}
        genres={convertObjectToName(episode?.genres)}
        number={episode?.episode_number || ""}
        player={{
          assetId: asset?.external_id || asset?.uid || "1",
          poster: getGraphQLImageSrc(episode?.images, ImageType.Poster),
          src: playbackUrl,
          provider: asset?.provider || undefined,
          playbackId: asset?.hls_id || asset?.dash_id || undefined,
        }}
        rating={getFirstRatingValue(episode?.ratings)}
        releaseDate={(episode?.release_date as string | undefined) || ""}
        season={{
          title: getTitleByOrderForGraphQLObject(
            episode?.seasons?.objects?.[0],
          ),
          number: episode?.seasons?.objects?.[0]?.season_number as number,
        }}
        synopsis={synopsis}
        tags={convertObjectToName(episode?.tags)}
        themes={convertObjectToName(episode?.themes)}
        title={title}
        uid={episode?.uid || ""}
      />
    </>
  );
};

export default EpisodePage;
