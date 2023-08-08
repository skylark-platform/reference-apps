import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";
import {
  convertObjectToName,
  formatGraphQLCredits,
  getFirstRatingValue,
  getFurthestAvailabilityEndDate,
  getGraphQLCreditsByType,
  getGraphQLImageSrc,
  getSynopsisByOrderForGraphQLObject,
  getTitleByOrderForGraphQLObject,
} from "../../lib/utils";
import { Availability, Episode, ImageType } from "../../types/gql";
import { DisplayError } from "../../components/displayError";
import { useObject } from "../../hooks/useObject";
import { GET_EPISODE } from "../../graphql/queries";
import { PlaybackPage } from "../../components/pages/playback";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject(
    "Episode",
    context.query.slug as string,
    context.locale || ""
  );

  return {
    props: {
      seo,
    },
  };
};

const EpisodePage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();
  const {
    data: episode,
    isError,
    isLoading,
  } = useObject<Episode>(GET_EPISODE, query?.slug as string);

  if (!isLoading && isError) {
    return (
      <DisplayError
        error={isError}
        notFoundMessage={`Episode "${query?.slug as string}" not found.`}
      />
    );
  }

  const title = getTitleByOrderForGraphQLObject(episode, [
    "title_short",
    "title",
  ]);
  const synopsis = getSynopsisByOrderForGraphQLObject(episode);

  const asset = episode?.assets?.objects?.[0];
  const playbackUrl = asset?.hls_url || asset?.url || "/mux-video-intro.mp4";

  const availabilityEndDate = getFurthestAvailabilityEndDate(
    episode?.availability?.objects as Availability[] | undefined
  );

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={title || seo.title}
      />
      <PlaybackPage
        availabilityEndDate={availabilityEndDate}
        brand={{
          title: getTitleByOrderForGraphQLObject(
            episode?.seasons?.objects?.[0]?.brands?.objects?.[0]
          ),
        }}
        credits={{
          actors: formatGraphQLCredits(
            getGraphQLCreditsByType(episode?.credits?.objects, "Actor")
          ),
          writers: formatGraphQLCredits(
            getGraphQLCreditsByType(episode?.credits?.objects, "Writer")
          ),
          directors: formatGraphQLCredits(
            getGraphQLCreditsByType(episode?.credits?.objects, "Director")
          ),
          presenters: formatGraphQLCredits(
            getGraphQLCreditsByType(episode?.credits?.objects, "Presenter")
          ),
          engineers: formatGraphQLCredits(
            getGraphQLCreditsByType(episode?.credits?.objects, "Engineer")
          ),
        }}
        genres={convertObjectToName(episode?.genres)}
        number={episode?.episode_number || ""}
        player={{
          assetId: asset?.external_id || asset?.uid || "1",
          poster: getGraphQLImageSrc(episode?.images, ImageType.Poster),
          src: playbackUrl,
        }}
        rating={getFirstRatingValue(episode?.ratings)}
        releaseDate={(episode?.release_date as string | undefined) || ""}
        season={{
          title: getTitleByOrderForGraphQLObject(
            episode?.seasons?.objects?.[0]
          ),
          number: episode?.seasons?.objects?.[0]?.season_number as number,
        }}
        synopsis={synopsis}
        tags={convertObjectToName(episode?.tags)}
        themes={convertObjectToName(episode?.themes)}
        title={title}
      />
    </>
  );
};

export default EpisodePage;
