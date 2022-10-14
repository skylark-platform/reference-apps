import type { GetServerSideProps, NextPage } from "next";
import { PlaybackPage } from "@skylark-reference-apps/react";
import {
  formatCredits,
  getCreditsByType,
  getImageSrc,
  getSynopsisByOrder,
  getTitleByOrder,
  Movie,
} from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useSingleObject } from "../../hooks/useSingleObject";
import { useAssetPlaybackUrl } from "../../hooks/useAssetPlaybackUrl";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject(
    "movie",
    context.query.slug as string,
    context.locale || ""
  );
  return {
    props: {
      seo,
    },
  };
};

const MoviePage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();
  const { data, isError } = useSingleObject("movie", query?.slug as string);
  const assetUid = data?.items?.isExpanded ? data?.items?.objects[0]?.uid : "";
  const { playbackUrl, isLoading } = useAssetPlaybackUrl(assetUid);

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching movie: ${(query?.slug as string) || ""}`}</p>
        <pre>{isError.message}</pre>
      </div>
    );
  }

  // if no object has no items then default to static video
  const playerSrc =
    !isLoading || (data && !assetUid)
      ? playbackUrl || "/mux-video-intro.mp4"
      : "";
  const movie = data as Movie | undefined;

  const titleLongToShort = getTitleByOrder(
    movie?.title,
    ["long", "medium", "short"],
    movie?.objectTitle
  );

  const synopsis = getSynopsisByOrder(movie?.synopsis, [
    "long",
    "medium",
    "short",
  ]);

  const brandTitleObject = movie?.parent?.isExpanded
    ? movie.parent.title
    : undefined;
  const brandTitle = getTitleByOrder(brandTitleObject, [
    "long",
    "medium",
    "short",
  ]);

  const themes: string[] = movie?.themes?.isExpanded
    ? movie.themes.items.map(({ name }) => name)
    : [];

  const genres: string[] = movie?.genres?.isExpanded
    ? movie.genres.items.map(({ name }) => name)
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
          actors: formatCredits(getCreditsByType(movie?.credits, "Actor")),
          writers: formatCredits(getCreditsByType(movie?.credits, "Writer")),
          directors: formatCredits(
            getCreditsByType(movie?.credits, "Director")
          ),
        }}
        genres={genres}
        loading={!movie}
        player={{
          assetId: assetUid,
          poster: getImageSrc(movie?.images, "Thumbnail"),
          src: playerSrc,
          duration: 58, // TODO read this from asset
        }}
        rating={
          movie?.ratings?.isExpanded
            ? movie.ratings.items?.[0]?.title
            : undefined
        }
        releaseDate={movie?.releaseDate}
        synopsis={synopsis}
        tags={[]}
        themes={themes}
        title={titleLongToShort}
      />
    </>
  );
};

export default MoviePage;
