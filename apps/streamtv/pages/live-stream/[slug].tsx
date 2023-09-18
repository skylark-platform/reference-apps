import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";
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

const LiveStreamPage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
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

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={liveStream?.title || liveStream?.title_short || seo.title}
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
        }}
        rating={getFirstRatingValue(liveStream?.ratings)}
        synopsis={synopsis}
        tags={convertObjectToName(liveStream?.tags)}
        themes={convertObjectToName(liveStream?.themes)}
        title={liveStream?.title || liveStream?.title_short || "Live Stream"}
      />
    </>
  );
};

export default LiveStreamPage;
