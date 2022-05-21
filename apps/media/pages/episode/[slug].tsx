import type { NextPage } from "next";
import Head from "next/head";
import { Player } from "@skylark-reference-apps/react";
import { Episode } from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { useSingleObjectBySlug } from "../../hooks/useSingleObjectBySlug";

const EpisodePage: NextPage = () => {
  const { query } = useRouter();

  const { data } = useSingleObjectBySlug("episode", query?.slug as string);
  const episode = data as Episode | undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-2 md:pt-64">
      <Head>
        <title>{`Skylark Media Reference App`}</title>
      </Head>
      <h1>{episode?.title?.short}</h1>
      <p>
        {episode?.credits?.map((credit) => (
          <>
            {credit.isExpanded && (
              <div>
                <p>{credit.character}</p>
                <p>{credit.roleUrl.title}</p>
                <p>{credit.peopleUrl.name}</p>
              </div>
            )}
          </>
        ))}
      </p>
      <Player
        poster="/movies/Movie%201.png"
        src="/mux-video-intro.mp4"
        videoId="1"
        videoTitle="Mux Video Intro"
      />
    </div>
  );
};

export default EpisodePage;
