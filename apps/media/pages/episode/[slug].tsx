import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  InformationPanel,
  MetadataPanel,
  Player,
  Skeleton,
} from "@skylark-reference-apps/react";
import {
  Episode,
  formatReleaseDate,
  getCreditsByType,
  getImageSrc,
  getTitleByOrder,
  Season,
} from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import {
  MdRecentActors,
  MdMovie,
  MdMode,
  MdCalendarToday,
} from "react-icons/md";
import { useSingleObjectBySlug } from "../../hooks/useSingleObjectBySlug";
import { useAssetPlaybackUrl } from "../../hooks/useAssetPlaybackUrl";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject(
    "episode",
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
  const { data } = useSingleObjectBySlug("episode", query?.slug as string);
  const assetUid = data?.items?.isExpanded ? data?.items?.objects[0]?.uid : "";
  const { playbackUrl, isLoading } = useAssetPlaybackUrl(assetUid);
  // if no object has no items then default to static video
  const playerSrc =
    !isLoading || (data && !assetUid)
      ? playbackUrl || "/mux-video-intro.mp4"
      : "";
  const episode = data as Episode | undefined;

  const titleShortToLong = getTitleByOrder(
    episode?.title,
    ["short", "medium", "long"],
    episode?.objectTitle
  );
  const titleLongToShort = getTitleByOrder(
    episode?.title,
    ["long", "medium", "short"],
    episode?.objectTitle
  );
  const parentParentTitle =
    episode?.parent?.isExpanded &&
    episode?.parent.parent?.isExpanded &&
    episode.parent.parent.title;

  const themes: string[] = episode?.themes?.isExpanded
    ? episode.themes.items.map(({ name }) => name)
    : [];
  const genres: string[] = episode?.genres?.isExpanded
    ? episode.genres.items.map(({ name }) => name)
    : [];

  return (
    <div className="flex min-h-screen flex-col items-center justify-start pb-20 md:pt-64">
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={titleLongToShort || seo.title}
      />
      <Skeleton show={!episode}>
        <div className="flex h-full w-full justify-center pb-10 md:pb-16">
          <Player
            poster={getImageSrc(episode?.images, "Thumbnail")}
            src={playerSrc}
            videoId={"1"}
            videoTitle={titleShortToLong}
          />
        </div>
        {episode && (
          <div className="flex w-full flex-col px-gutter sm:px-sm-gutter md:flex-row md:py-2 lg:px-lg-gutter xl:px-xl-gutter">
            <div className="h-full w-full pb-4 md:w-7/12">
              <InformationPanel
                availableUntil={12}
                description={
                  episode.synopsis.long ||
                  episode.synopsis.medium ||
                  episode.synopsis.short
                }
                duration={57}
                genres={genres}
                parentTitles={[
                  getTitleByOrder(parentParentTitle || undefined, [
                    "long",
                    "medium",
                    "short",
                  ]),
                ]}
                rating={
                  episode?.ratings?.isExpanded
                    ? episode.ratings.items?.[0]?.title
                    : undefined
                }
                seasonNumber={
                  episode.parent?.isExpanded
                    ? (episode.parent as Season)?.number
                    : ""
                }
                themes={themes}
                title={
                  episode.number
                    ? `${episode.number}. ${titleLongToShort}`
                    : titleLongToShort
                }
              />
            </div>
            <span className="flex border-gray-800 bg-gray-900 md:mx-3 md:border-r" />
            <div className="h-full w-full pl-1 sm:pl-5 md:w-5/12">
              <div className="flex justify-center">
                <span className="mb-4 w-4/5 border-b border-gray-800 md:hidden" />
              </div>
              <MetadataPanel
                content={[
                  {
                    icon: <MdRecentActors />,
                    header: "Key Cast",
                    body: getCreditsByType(episode.credits, "Actor").map(
                      (credit) => credit?.peopleUrl?.name || ""
                    ),
                  },
                  {
                    icon: <MdMovie />,
                    header: "Directors",
                    body: getCreditsByType(episode.credits, "Director").map(
                      (credit) => credit?.peopleUrl?.name || ""
                    ),
                  },
                  {
                    icon: <MdMode />,
                    header: "Writers",
                    body: getCreditsByType(episode.credits, "Writer").map(
                      (credit) => credit?.peopleUrl?.name || ""
                    ),
                  },
                  {
                    icon: <MdCalendarToday />,
                    header: "Released",
                    body: episode.parent?.isExpanded
                      ? formatReleaseDate(episode.releaseDate)
                      : "",
                  },
                ]}
              />
            </div>
          </div>
        )}
      </Skeleton>
    </div>
  );
};

export default EpisodePage;
