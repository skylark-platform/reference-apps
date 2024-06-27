import React from "react";
import { formatReleaseDate } from "@skylark-reference-apps/lib";
import useTranslation from "next-translate/useTranslation";
import {
  MdCalendarToday,
  MdGrade,
  MdMode,
  MdMovie,
  MdPhotoCameraFront,
  MdRecentActors,
  MdSettings,
  MdTag,
} from "react-icons/md";
import {
  InformationPanel,
  Link,
  MetadataPanel,
  Player,
  SkeletonPage,
} from "@skylark-reference-apps/react";
import { Dayjs } from "dayjs";
import { NextPage } from "next";
import { getTimeFromNow } from "../../../lib/utils";
import { ListPersonOtherCreditsRail } from "../../rails";

interface PlaybackPageProps {
  uid: string;
  loading?: boolean;
  title: string;
  synopsis?: string;
  genres?: string[];
  themes?: string[];
  tags: string[];
  rating?: string;
  player: {
    assetId: string;
    src: string;
    poster: string;
    duration?: number;
    autoPlay?: boolean;
  };
  number?: string | number;
  releaseDate?: string;
  brand?: {
    title: string;
    uid: string;
  };
  season?: {
    title?: string;
    number?: string | number;
  };
  credits?: Record<
    string,
    {
      formattedCredits: { personUid: string; name: string }[];
      translatedRole: string;
    }
  >;
  availabilityEndDate: Dayjs | null;
}

const getIconForCreditRole = (role: string) => {
  switch (role) {
    case "Actor":
      return <MdRecentActors />;
    case "Director":
      return <MdMovie />;
    case "Writer":
      return <MdMode />;
    case "Presenter":
      return <MdPhotoCameraFront />;
    case "Engineer":
      return <MdSettings />;

    default:
      return <MdGrade />;
  }
};

const convertCreditsToMetadataContent = (
  credits?: Record<
    string,
    {
      formattedCredits: { personUid: string; name: string }[];
      translatedRole: string;
    }
  >,
) => {
  if (!credits || Object.keys(credits).length === 0) {
    return [];
  }

  return Object.entries(credits).map(
    ([role, { formattedCredits, translatedRole }]) => ({
      header: translatedRole,
      body: (
        <div>
          {formattedCredits.map(({ name, personUid }, i) => (
            <>
              <Link
                className="hover:text-skylarktv-accent"
                href={`/person/${personUid}`}
                key={personUid}
              >
                {name}
              </Link>
              {i < formattedCredits.length - 1 && <span>{`, `}</span>}
            </>
          ))}
        </div>
      ),
      icon: getIconForCreditRole(role),
    }),
  );
};

export const PlaybackPage: NextPage<PlaybackPageProps> = ({
  uid,
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
  availabilityEndDate,
}) => {
  const { t, lang } = useTranslation("common");

  const allCredits = credits
    ? Object.values(credits)
        .map(({ formattedCredits }) => formattedCredits)
        .flatMap((arr) => arr)
        .filter(
          (obj, index, arr) =>
            arr.findIndex(({ personUid }) => personUid === obj.personUid) ===
            index,
        )
    : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-900 pb-20 font-body md:pt-64">
      <SkeletonPage show={!!loading}>
        <div className="flex h-full w-full justify-center pb-10 md:pb-16">
          <Player
            autoPlay={player.autoPlay}
            poster={player.poster}
            src={player.src}
            videoId={player.assetId}
            videoTitle={title}
          />
        </div>
        <div className="flex w-full flex-col px-gutter sm:px-sm-gutter md:flex-row md:py-2 lg:px-lg-gutter xl:px-xl-gutter">
          <div className="h-full w-full pb-4 md:w-7/12">
            <InformationPanel
              availableUntil={
                availabilityEndDate
                  ? getTimeFromNow(availabilityEndDate)
                  : undefined
              }
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
          <div className="h-full w-full pt-4 ltr:pl-1 rtl:pr-1 ltr:sm:pl-5 rtl:sm:pr-5 md:w-5/12">
            <div className="flex justify-center">
              <span className="mb-4 w-4/5 border-b border-gray-800 md:hidden" />
            </div>
            <MetadataPanel
              content={[
                ...convertCreditsToMetadataContent(credits),
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
              ].filter(({ body }) =>
                Array.isArray(body)
                  ? body.length > 0
                  : React.isValidElement(body),
              )}
            />
          </div>
        </div>
        {allCredits && (
          <div className="my-4 w-full">
            {allCredits.map(({ personUid }) => (
              <ListPersonOtherCreditsRail
                key={personUid}
                originalObjectUid={uid}
                uid={personUid}
              />
            ))}
          </div>
        )}
      </SkeletonPage>
    </div>
  );
};
