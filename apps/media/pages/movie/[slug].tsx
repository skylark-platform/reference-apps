import type { NextPage } from "next";
import {
  InformationPanel,
  MetadataPanel,
  Player,
} from "@skylark-reference-apps/react";
import {
  getCreditsByType,
  getImageSrc,
  getTitleByOrder,
  Movie,
} from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MdRecentActors,
  MdMovie,
  MdMode,
  MdCalendarToday,
} from "react-icons/md";
import { useSingleObjectBySlug } from "../../hooks/useSingleObjectBySlug";
import { useAssetPlaybackUrl } from "../../hooks/useAssetPlaybackUrl";

const MoviePage: NextPage = () => {
  const { query } = useRouter();
  const { data } = useSingleObjectBySlug("movie", query?.slug as string);
  const assetUid = data?.items?.isExpanded ? data?.items?.objects[0]?.uid : "";
  const { playbackUrl, isLoading } = useAssetPlaybackUrl(assetUid);
  // if no object has no items then default to static video
  const playerSrc =
    !isLoading || (data && !assetUid)
      ? playbackUrl || "/mux-video-intro.mp4"
      : "";
  const movie = data as Movie | undefined;

  const titleShortToLong = getTitleByOrder(
    movie?.title,
    ["short", "medium", "long"],
    movie?.objectTitle
  );
  const titleLongToShort = getTitleByOrder(
    movie?.title,
    ["long", "medium", "short"],
    movie?.objectTitle
  );

  const parentTitle = movie?.parent?.isExpanded && movie.parent.title;

  const themes: string[] = movie?.themes?.isExpanded
    ? movie.themes.items.map(({ name }) => name)
    : [];

  const genres: string[] = movie?.genres?.isExpanded
    ? movie.genres.items.map(({ name }) => name)
    : [];

  return (
    <div className="flex min-h-screen flex-col items-center justify-start pb-20 md:pt-64">
      <Head>
        <title>{`${titleShortToLong || "Movie page"} - StreamTV`}</title>
      </Head>
      <div className="flex h-full w-full justify-center pb-10 md:pb-16">
        <Player
          poster={getImageSrc(movie?.images, "Thumbnail")}
          src={playerSrc}
          videoId="1"
          videoTitle={titleShortToLong || ""}
        />
      </div>
      {movie && (
        <div className="flex w-full flex-col px-gutter sm:px-sm-gutter md:flex-row md:py-2 lg:px-lg-gutter xl:px-xl-gutter">
          <div className="h-full w-full pb-4 md:w-7/12">
            <InformationPanel
              availableUntil={12}
              description={
                movie.synopsis.long ||
                movie.synopsis.medium ||
                movie.synopsis.short
              }
              duration={57}
              genres={genres}
              parentTitles={[
                getTitleByOrder(parentTitle || undefined, [
                  "long",
                  "medium",
                  "short",
                ]),
              ]}
              rating={
                movie?.ratings?.isExpanded
                  ? movie.ratings.items?.[0]?.title
                  : undefined
              }
              themes={themes}
              title={titleLongToShort || ""}
            />
          </div>
          <span className="flex border-gray-800 bg-gray-900 md:mx-3 md:border-r" />
          <div className="h-full w-full pt-4 pl-1 sm:pl-5 md:w-5/12">
            <div className="flex justify-center">
              <span className="mb-4 w-4/5 border-b border-gray-800 md:hidden" />
            </div>
            <MetadataPanel
              content={[
                {
                  icon: <MdRecentActors />,
                  header: "Key Cast",
                  body: getCreditsByType(movie.credits, "Actor").map(
                    (credit) => credit?.peopleUrl?.name || ""
                  ),
                },
                {
                  icon: <MdMovie />,
                  header: "Directors",
                  body: getCreditsByType(movie.credits, "Director").map(
                    (credit) => credit?.peopleUrl?.name || ""
                  ),
                },
                {
                  icon: <MdMode />,
                  header: "Writers",
                  body: getCreditsByType(movie.credits, "Writer").map(
                    (credit) => credit?.peopleUrl?.name || ""
                  ),
                },
                {
                  icon: <MdCalendarToday />,
                  header: "Released",
                  body: "10 April 2011",
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviePage;
