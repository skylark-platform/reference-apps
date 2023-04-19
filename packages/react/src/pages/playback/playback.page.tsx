import React from "react";
import type { NextPage } from "next";
import { formatReleaseDate } from "@skylark-reference-apps/lib";
import useTranslation from "next-translate/useTranslation";
import {
  MdRecentActors,
  MdMovie,
  MdMode,
  MdCalendarToday,
  MdPhotoCameraFront,
  MdSettings,
  MdTag,
} from "react-icons/md";
import {
  InformationPanel,
  MetadataPanel,
  Player,
  SkeletonPage,
} from "../../components";

interface Props {
  loading?: boolean;
  title: string;
  synopsis: string;
  genres: string[];
  themes: string[];
  tags: string[];
  rating?: string;
  player: {
    assetId: string;
    src: string;
    poster: string;
    duration?: number;
  };
  number?: string | number;
  releaseDate?: string;
  brand?: {
    title: string;
  };
  season?: {
    title?: string;
    number?: string | number;
  };
  credits: {
    actors: string[];
    directors: string[];
    writers: string[];
    presenters?: string[];
    engineers?: string[];
  };
}

export const PlaybackPage: NextPage<Props> = ({
  loading,
  title,
  synopsis,
  genres,
  themes,
  tags,
  rating,
  player,
  number,
  releaseDate,
  brand,
  season,
  credits,
}) => {
  const { t, lang } = useTranslation("common");

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-900 pb-20 font-body md:pt-64">
      <SkeletonPage show={!!loading}>
        <div className="flex h-full w-full justify-center pb-10 md:pb-16">
          <Player
            poster={player.poster}
            src={player.src}
            videoId={player.assetId}
            videoTitle={title}
          />
        </div>
        <div className="flex w-full flex-col px-gutter sm:px-sm-gutter md:flex-row md:py-2 lg:px-lg-gutter xl:px-xl-gutter">
          <div className="h-full w-full pb-4 md:w-7/12">
            <InformationPanel
              availableUntil={12}
              brand={brand}
              description={synopsis}
              duration={player.duration}
              genres={genres}
              rating={rating}
              season={season}
              themes={themes}
              title={number ? `${number}. ${title}` : title}
            />
          </div>
          <span className="flex border-gray-800 bg-gray-900 md:mx-3 md:border-r" />
          <div className="h-full w-full pl-1 pt-4 sm:pl-5 md:w-5/12">
            <div className="flex justify-center">
              <span className="mb-4 w-4/5 border-b border-gray-800 md:hidden" />
            </div>
            <MetadataPanel
              content={[
                {
                  icon: <MdRecentActors />,
                  header: t("skylark.role.key-cast"),
                  body: credits.actors,
                },
                {
                  icon: <MdMovie />,
                  header: t("skylark.role.directors"),
                  body: credits.directors,
                },
                {
                  icon: <MdMode />,
                  header: t("skylark.role.writers"),
                  body: credits.writers,
                },
                {
                  icon: <MdPhotoCameraFront />,
                  header: t("skylark.role.presenters"),
                  body: credits.presenters || [],
                },
                {
                  icon: <MdSettings />,
                  header: t("skylark.role.engineers"),
                  body: credits.engineers || [],
                },
                {
                  icon: <MdCalendarToday />,
                  header: t("released"),
                  body: formatReleaseDate(releaseDate, lang),
                },
                {
                  icon: <MdTag />,
                  header: t("tags"),
                  body: tags,
                },
              ].filter(({ body }) => body.length > 0)}
            />
          </div>
        </div>
      </SkeletonPage>
    </div>
  );
};
