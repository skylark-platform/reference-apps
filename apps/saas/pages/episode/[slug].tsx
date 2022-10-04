import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { PlaybackPage } from "@skylark-reference-apps/react";
import {
  getSynopsisByOrder,
  getTitleByOrder,
} from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { useSingleObject } from "../../hooks/useSingleObject";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";

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

  const title = getTitleByOrder({
    short: episode?.title_short || "",
    medium: episode?.title_medium || "",
    long: episode?.title_long || "",
  });

  const synopsis = getSynopsisByOrder({
    short: episode?.synopsis_short || "",
    medium: episode?.synopsis_medium || "",
    long: episode?.synopsis_long || "",
  });

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={title || seo.title}
      />
      <PlaybackPage
        brand={{
          title:
            episode?.seasons?.objects?.[0]?.brands?.objects?.[0]?.title_short ||
            "",
        }}
        credits={{
          actors:
            episode?.credits?.objects
              ?.filter(
                (credit) => credit?.roles?.objects?.[0]?.title === "Actor"
              )
              ?.map((credit) =>
                credit?.character && credit?.people?.objects?.[0]?.name
                  ? `${credit?.people?.objects?.[0]?.name} as ${credit?.character}`
                  : credit?.people?.objects?.[0]?.name || ""
              ) || [],
          writers:
            episode?.credits?.objects
              ?.filter(
                (credit) => credit?.roles?.objects?.[0]?.title === "Writer"
              )
              ?.map((credit) =>
                credit?.character && credit?.people?.objects?.[0]?.name
                  ? `${credit?.people?.objects?.[0]?.name} as ${credit?.character}`
                  : credit?.people?.objects?.[0]?.name || ""
              ) || [],
          directors:
            episode?.credits?.objects
              ?.filter(
                (credit) => credit?.roles?.objects?.[0]?.title === "Director"
              )
              ?.map((credit) =>
                credit?.character && credit?.people?.objects?.[0]?.name
                  ? `${credit?.people?.objects?.[0]?.name} as ${credit?.character}`
                  : credit?.people?.objects?.[0]?.name || ""
              ) || [],
        }}
        genres={
          episode?.genres?.objects?.map((genre) =>
            genre && genre.name ? genre.name : ""
          ) || []
        }
        number={episode?.episode_number || ""}
        player={{
          assetId: "1",
          poster:
            (
              episode?.images?.objects?.find(
                (img) => img?.image_type === "Poster"
              ) || episode?.images?.objects?.[0]
            )?.image_url || "",
          src: "/mux-video-intro.mp4",
          duration: 58, // TODO read this from asset
        }}
        rating={episode?.ratings?.objects?.[0]?.value}
        releaseDate={undefined}
        season={{
          number: episode?.seasons?.objects?.[0]?.season_number as number,
        }}
        synopsis={synopsis}
        themes={
          episode?.themes?.objects?.map((themes) =>
            themes && themes.name ? themes.name : ""
          ) || []
        }
        title={title}
      />
    </>
  );
};

export default EpisodePage;
