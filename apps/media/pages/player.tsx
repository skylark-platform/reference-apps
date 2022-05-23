import type { NextPage } from "next";
import Head from "next/head";
import {
  InformationPanel,
  MetadataPanel,
  Player,
} from "@skylark-reference-apps/react";
import {
  MdRecentActors,
  MdMovie,
  MdMode,
  MdCalendarToday,
} from "react-icons/md";

const PlayerPage: NextPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-start py-2 pt-14 md:pt-64">
    <Head>
      <title>{`Skylark Media Reference App`}</title>
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
            "Series Premiere. Lord Stark is troubled by disturbing reports from a Night's Watch deserter."
          }
          duration={57}
          episode={"1. Winter is Coming"}
          genres={["Drama", "Mythical", "Based on a book"]}
          rating={"18+"}
          season={1}
          show={"Game of Thrones"}
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
              body: "10 April 2011",
            },
          ]}
        />
      </div>
    </div>
  </div>
);

export default PlayerPage;
