import type { NextPage } from "next";
import Head from "next/head";
import { Player } from "@skylark-reference-apps/react";
import useSWR from "swr";
import { SKYLARK_API, Episode, ApiEpisode } from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";

const episodeByUidFetcher = (episodeUid: string) =>
  fetch(
    `${SKYLARK_API}/api/episodes/${episodeUid}/?fields_to_expand=items&fields=items,title,title_short`
  )
    .then((r) => r.json())
    .then((episode: ApiEpisode) => {
      const parsedEpisode: Episode = {
        isExpanded: true,
        self: episode.self,
        objectTitle: episode.title,
        type: "episode",
        number: episode.episode_number,
        title: {
          short: episode.title_short,
          medium: episode.title_medium,
          long: episode.title_long,
        },
        synopsis: {
          short: episode.synopsis_short,
          medium: episode.synopsis_medium,
          long: episode.synopsis_long,
        },
        slug: episode.slug,
        uid: episode.uid,
        images: episode.image_urls?.map(
          ({ image_type, url, url_path, self }) => ({
            isExpanded: true,
            self,
            type: image_type,
            url,
            urlPath: url_path,
          })
        ),
        items: episode.items.map((item) => ({
          isExpanded: true,
          type: "asset",
          uid: "",
          slug: "",
          objectTitle: "",
          self: item.self,
        })),
      };
      return parsedEpisode;
    });

const BrandPage: NextPage = () => {
  const { query } = useRouter();

  const { data: episode } = useSWR<Episode, any>(
    query?.uid,
    episodeByUidFetcher
  );
  console.log({ episode });

  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-2 pt-14 md:pt-64">
      <Head>
        <title>{`Skylark Media Reference App`}</title>
      </Head>
      <h1>{episode?.title?.short}</h1>
      <Player
        poster="/movies/Movie%201.png"
        src="/mux-video-intro.mp4"
        videoId="1"
        videoTitle="Mux Video Intro"
      />
    </div>
  );
};

export default BrandPage;
