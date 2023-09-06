import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";
import { convertObjectToName, getGraphQLImageSrc } from "../../lib/utils";
import { ImageType, LiveStream } from "../../types/gql";
import { DisplayError } from "../../components/displayError";
import { useObject } from "../../hooks/useObject";
import { GET_LIVE_STREAM } from "../../graphql/queries";
import { PlaybackPage } from "../../components/pages/playback";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject(
    "SkylarkLiveStream",
    context.query.slug as string,
    context.locale || ""
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

  const asset = liveStream?.assets?.objects?.[0];
  const playbackUrl = asset?.hls_url || asset?.url || "/mux-video-intro.mp4";

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={liveStream?.title || liveStream?.title_short || seo.title}
      />
      <PlaybackPage
        availabilityEndDate={null}
        loading={!liveStream}
        player={{
          assetId: asset?.external_id || asset?.uid || "1",
          poster: getGraphQLImageSrc(liveStream?.images, ImageType.Poster),
          src: playbackUrl,
        }}
        tags={convertObjectToName(liveStream?.tags)}
        title={liveStream?.title || liveStream?.title_short || "Live Stream"}
      />
    </>
  );
};

export default LiveStreamPage;
