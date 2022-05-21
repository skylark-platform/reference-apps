import type { NextPage } from "next";
import Head from "next/head";
import { Player } from "@skylark-reference-apps/react";

const PlayerPage: NextPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-start py-2 md:pt-64">
    <Head>
      <title>{`Skylark Media Reference App`}</title>
    </Head>

    <Player
      poster="/movies/Movie%201.png"
      src="/mux-video-intro.mp4"
      videoId="1"
      videoTitle="Mux Video Intro"
    />
  </div>
);

export default PlayerPage;
