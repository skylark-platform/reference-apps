import type { GetServerSideProps, NextPage } from "next";
import { PlaybackPage } from "@skylark-reference-apps/react";
import {
  Episode,
  formatCredits,
  getCreditsByType,
  getImageSrc,
  getSynopsisByOrder,
  getTitleByOrder,
  Season,
} from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useSingleObject } from "../../hooks/useSingleObject";
import { useAssetPlaybackUrl } from "../../hooks/useAssetPlaybackUrl";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject(
    "episode",
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
  const { data, isError } = useSingleObject("episode", query?.slug as string);

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching episode: ${(query?.slug as string) || ""}`}</p>
        <pre>{isError.message}</pre>
      </div>
    );
  }

  const assetUid = data?.items?.isExpanded ? data?.items?.objects[0]?.uid : "";
  const { playbackUrl, isLoading } = useAssetPlaybackUrl(assetUid);
  // if no object has no items then default to static video
  const playerSrc =
    !isLoading || (data && !assetUid)
      ? playbackUrl || "/mux-video-intro.mp4"
      : "";
  const episode = data as Episode | undefined;

  const titleLongToShort = getTitleByOrder(
    episode?.title,
    ["long", "medium", "short"],
    episode?.objectTitle
  );
  const brandTitleObject =
    (episode?.parent?.isExpanded &&
      episode?.parent.parent?.isExpanded &&
      episode.parent.parent.title) ||
    undefined;
  const brandTitle = getTitleByOrder(brandTitleObject, [
    "long",
    "medium",
    "short",
  ]);

  const synopsis = getSynopsisByOrder(episode?.synopsis, [
    "long",
    "medium",
    "short",
  ]);

  const themes: string[] = episode?.themes?.isExpanded
    ? episode.themes.items.map(({ name }) => name)
    : [];
  const genres: string[] = episode?.genres?.isExpanded
    ? episode.genres.items.map(({ name }) => name)
    : [];

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={titleLongToShort || seo.title}
      />
      <PlaybackPage
        brand={{
          title: brandTitle,
        }}
        credits={{
          actors: formatCredits(getCreditsByType(episode?.credits, "Actor")),
          writers: formatCredits(getCreditsByType(episode?.credits, "Writer")),
          directors: formatCredits(
            getCreditsByType(episode?.credits, "Director")
          ),
        }}
        genres={genres}
        number={episode?.number}
        player={{
          assetId: assetUid,
          poster: getImageSrc(episode?.images, "Thumbnail"),
          src: playerSrc,
          duration: 58, // TODO read this from asset
        }}
        rating={
          episode?.ratings?.isExpanded
            ? episode.ratings.items?.[0]?.title
            : undefined
        }
        releaseDate={episode?.releaseDate}
        season={{
          number: episode?.parent?.isExpanded
            ? (episode.parent as Season)?.number
            : undefined,
        }}
        synopsis={synopsis}
        themes={themes}
        title={titleLongToShort}
      />
    </>
  );
};

export default EpisodePage;
