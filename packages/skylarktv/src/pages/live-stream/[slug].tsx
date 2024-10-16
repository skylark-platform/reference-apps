import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import {
  SeoObjectData,
  convertObjectImagesToSeoImages,
  getSeoDataForObject,
} from "../../lib/getPageSeoData";
import { DisplayError } from "../../components/displayError";
import { PlaybackPage } from "../../components/pages/playback";
import { GET_LIVE_STREAM } from "../../graphql/queries";
import { useObject } from "../../hooks/useObject";
import {
  getSynopsisByOrderForGraphQLObject,
  getFurthestAvailabilityEndDate,
  splitAndFormatGraphQLCreditsByInternalTitle,
  convertObjectToName,
  getGraphQLImageSrc,
  getFirstRatingValue,
} from "../../lib/utils";
import { LiveStream, Availability, ImageType } from "../../types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject(
    "SkylarkLiveStream",
    context.query.slug as string,
    context.locale || "",
  );

  return {
    props: {
      seo,
    },
  };
};

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
    liveAsset?.hls_url || liveAsset?.url || asset?.hls_url || asset?.url || "";

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
          provider: asset?.provider || undefined,
          playbackId: asset?.hls_id || asset?.dash_id || undefined,
        }}
        rating={getFirstRatingValue(liveStream?.ratings)}
        synopsis={synopsis}
        tags={convertObjectToName(liveStream?.tags)}
        themes={convertObjectToName(liveStream?.themes)}
        title={title || "Live Stream"}
        uid={liveStream?.uid || ""}
      />
    </>
  );
};

export default LiveStreamPage;
