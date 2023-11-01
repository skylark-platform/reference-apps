import type { NextPage } from "next";
import { useRouter } from "next/router";
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
  splitAndFormatGraphQLCreditsByInternalTitle,
} from "../../lib/utils";
import { Availability, ImageType, LiveStream } from "../../types/gql";
import { DisplayError } from "../../components/displayError";
import { useObject } from "../../hooks/useObject";
import { GET_LIVE_STREAM } from "../../graphql/queries";
import { PlaybackPage } from "../../components/pages/playback";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const seo = await getSeoDataForObject(
//     "SkylarkLiveStream",
//     context.query.slug as string,
//     context.locale || "",
//   );

//   return {
//     props: {
//       seo,
//     },
//   };
// };

const LiveStreamPage: NextPage<{ seo?: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();
  const {
    data: liveStream,
    isError,
    isLoading,
  } = useObject<LiveStream>(GET_LIVE_STREAM, query?.slug as string);

  if (!isLoading && isError) {
    return (
      <DisplayError
        error={isError}
        notFoundMessage={`Live Stream "${query?.slug as string}" not found.`}
      />
    );
  }

  const liveAsset = liveStream?.live_assets?.objects?.[0];
  const asset = liveStream?.assets?.objects?.[0];
  const playbackUrl =
    liveAsset?.hls_url ||
    liveAsset?.url ||
    asset?.hls_url ||
    asset?.url ||
    "/mux-video-intro.mp4";

  const synopsis = getSynopsisByOrderForGraphQLObject(liveStream);
  const availabilityEndDate = getFurthestAvailabilityEndDate(
    liveStream?.availability?.objects as Availability[] | undefined,
  );

  const title = liveStream?.title || liveStream?.title_short;

  return (
    <>
      <NextSeo
        description={synopsis || seo?.synopsis || ""}
        openGraph={{
          images:
            convertObjectImagesToSeoImages(liveStream?.images) ||
            convertObjectImagesToSeoImages(liveAsset?.images) ||
            convertObjectImagesToSeoImages(asset?.images) ||
            seo?.images ||
            [],
        }}
        title={title || seo?.title || "Live Stream"}
      />
      <PlaybackPage
        availabilityEndDate={availabilityEndDate}
        credits={splitAndFormatGraphQLCreditsByInternalTitle(
          liveStream?.credits?.objects,
        )}
        genres={convertObjectToName(liveStream?.genres)}
        loading={!liveStream}
        player={{
          assetId: liveAsset
            ? liveAsset.external_id || liveAsset.uid
            : asset?.external_id || asset?.uid || "1",
          poster: getGraphQLImageSrc(liveStream?.images, ImageType.Poster),
          src: playbackUrl,
          autoPlay: true,
        }}
        rating={getFirstRatingValue(liveStream?.ratings)}
        synopsis={synopsis}
        tags={convertObjectToName(liveStream?.tags)}
        themes={convertObjectToName(liveStream?.themes)}
        title={title || "Live Stream"}
      />
    </>
  );
};

export default LiveStreamPage;
