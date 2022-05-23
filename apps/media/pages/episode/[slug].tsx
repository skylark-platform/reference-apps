import type { NextPage } from "next";
import Head from "next/head";
import {
  InformationPanel,
  MetadataPanel,
  Player,
} from "@skylark-reference-apps/react";
import { Episode, getTitleByOrder, Season } from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import {
  MdRecentActors,
  MdMovie,
  MdMode,
  MdCalendarToday,
} from "react-icons/md";
import { useSingleObjectBySlug } from "../../hooks/useSingleObjectBySlug";

const EpisodePage: NextPage = () => {
  const { query } = useRouter();
  const { data } = useSingleObjectBySlug("episode", query?.slug as string);
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
  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-2 md:pt-64">
      <Head>
        <title>{`${titleShortToLong || "Episode page"} - StreamTV`}</title>
      </Head>
      <div className="flex h-full w-full justify-center py-10 md:py-0 md:pb-16">
        <Player
          src={"/mux-video-intro.mp4"}
          videoId={"1"}
          videoTitle={"Mux Video Intro"}
        />
      </div>
      <div className="flex flex-col md:flex-row md:py-2">
        <div className="ml-6 h-full w-full pb-4 md:w-6/12 lg:w-8/12">
          <InformationPanel
            availableUntil={12}
            description={
              episode?.synopsis.long ||
              episode?.synopsis.medium ||
              episode?.synopsis.short
            }
            duration={57}
            parentTitles={[
              getTitleByOrder(parentParentTitle || undefined, [
                "long",
                "medium",
                "short",
              ]),
            ]}
            rating={
              episode?.ratings?.[0]?.isExpanded
                ? episode?.ratings?.[0].title
                : undefined
            }
            seasonNumber={
              episode?.parent?.isExpanded
                ? (episode.parent as Season)?.number
                : ""
            }
            themes={episode?.themes.map((theme) =>
              theme.isExpanded ? theme.name : ""
            )}
            title={
              episode?.number
                ? `${episode.number}. ${titleLongToShort}`
                : titleLongToShort
            }
          />
        </div>
        <div className="h-full w-full md:w-6/12 lg:w-4/12">
          <div className="flex justify-center">
            <span className="mb-4 w-1/5 border-b-[1px] border-gray-800 md:hidden" />
          </div>
          <MetadataPanel
            content={[
              {
                icon: <MdRecentActors />,
                header: "Key Cast",
                body: "Michelle Fairley, Lena Headey, Emilia Clarke, Iain Glen, Harry Lloyd",
              },
              {
                icon: <MdMovie />,
                header: "Producers",
                body: [
                  "Mark Huffam",
                  "Carolyn Strauss",
                  "Joanna Burn",
                  "Frank Doelger",
                  "Guymon Casady",
                ],
              },
              {
                icon: <MdMode />,
                header: "Writers",
                body: "Mark Huffam, Carolyn Strauss, Joanna Burn, Frank Doelger, Guymon Casady",
              },
              {
                icon: <MdCalendarToday />,
                header: "Released",
                body: episode?.parent?.isExpanded
                  ? `${(episode.parent as Season)?.year}`
                  : "",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default EpisodePage;
