import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { PlaybackPage } from "@skylark-reference-apps/react";
import { useRouter } from "next/router";
import { useSingleObject } from "../../hooks/useSingleObject";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";
import {
  convertObjectToName,
  formatGraphQLCredits,
  getFirstRatingValue,
  getGraphQLCreditsByType,
  getGraphQLImageSrc,
  getSynopsisByOrderForGraphQLObject,
  getTitleByOrderForGraphQLObject,
} from "../../lib/utils";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject(
    "Episode",
    context.query.slug as string
  );

  return {
    props: {
      seo,
    },
  };
};

const EpisodePage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();
  const { data: episode, isError } = useSingleObject(
    "Episode",
    query?.slug as string
  );

  if (isError || !episode) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching episode: ${(query?.slug as string) || ""}`}</p>
        <p>{isError?.message}</p>
      </div>
    );
  }

  const title = getTitleByOrderForGraphQLObject(episode);
  const synopsis = getSynopsisByOrderForGraphQLObject(episode);

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={title || seo.title}
      />
      <PlaybackPage
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
        }}
        genres={convertObjectToName(episode.genres)}
        number={episode?.episode_number || ""}
        player={{
          assetId: "1",
          poster: getGraphQLImageSrc(episode?.images, "Poster"),
          src: "/mux-video-intro.mp4",
          duration: 58, // TODO read this from asset
        }}
        rating={getFirstRatingValue(episode.ratings)}
        releaseDate={episode.release_date || ""}
        season={{
          number: episode?.seasons?.objects?.[0]?.season_number as number,
        }}
        synopsis={synopsis}
        themes={convertObjectToName(episode.themes)}
        title={title}
      />
    </>
  );
};

export default EpisodePage;
