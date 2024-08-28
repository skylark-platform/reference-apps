import React, { useMemo, useState } from "react";
import { formatReleaseDate } from "@skylark-reference-apps/lib";
import useTranslation from "next-translate/useTranslation";
import {
  MdBook,
  MdCalendarToday,
  MdMode,
  MdMoney,
  MdMovie,
  MdPeople,
  MdPhotoCameraFront,
  MdRecentActors,
  MdSettings,
  MdStar,
  MdStarHalf,
  MdStarOutline,
  MdTag,
} from "react-icons/md";
import {
  InformationPanel,
  Link,
  MetadataPanel,
  Player,
  PlayerChapter,
  PlayerCuePoint,
  SkeletonPage,
} from "@skylark-reference-apps/react";
import { Dayjs } from "dayjs";
import { NextPage } from "next";
import { getTimeFromNow } from "../../../lib/utils";
import { ListPersonOtherCreditsRail } from "../../rails";
import { useObject } from "../../../hooks/useObject";
import { GET_ASSET } from "../../../graphql/queries";
import {
  ChapterListing,
  Maybe,
  SkylarkAsset,
  TimecodeEventListing,
  TimecodeEventType,
  TimecodeEventWithType,
} from "../../../types";
import { useMuxPlaybackTokens } from "../../../hooks/useMuxPlaybackToken";
import { PlayerTimecodeEvent } from "../../playerTimecodeEvent";
import { PlayerPauseOverlay } from "../../playerPauseOverlay";

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
    playbackId?: string;
    poster: string;
    duration?: number;
    autoPlay?: boolean;
    provider?: string;
  };
  number?: string | number;
  releaseDate?: string;
  budget?: string | number;
  audienceRating?: string;
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
      formattedCredits: {
        personUid: string;
        name: string;
        character?: string;
      }[];
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
    case "Author":
      return <MdBook />;
    case "Presenter":
      return <MdPhotoCameraFront />;
    case "Engineer":
      return <MdSettings />;
    default:
      return <MdPeople />;
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
                key={`${role}-${personUid}`}
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

const convertAudienceRatingToStars = (rating?: string | number) => {
  const parsedRating = typeof rating === "string" ? parseFloat(rating) : rating;

  if (!parsedRating || Number.isNaN(parsedRating)) {
    return null;
  }

  const outOf5 = parsedRating / 2;

  const numberFullStars = Math.floor(outOf5);
  const showHalfStar = parsedRating % 2 > 1;

  return (
    <div className="flex h-full items-center text-xl">
      {Array.from({ length: 5 }, (_, index) => {
        if (index < numberFullStars) {
          return <MdStar key={`full-star-${index}`} />;
        }

        if (index <= numberFullStars && showHalfStar) {
          return <MdStarHalf key={`half-star-${index}`} />;
        }

        return <MdStarOutline key={`empty-star-${index}`} />;
      })}
    </div>
  );
};

const convertTimecodeEventsToPlayerCuePoints = (
  timecodeEventListing: Maybe<TimecodeEventListing> | undefined,
) =>
  timecodeEventListing?.objects
    ?.map(
      (evt) =>
        evt &&
        typeof evt.timecode === "number" && {
          startTime: evt.timecode,
          payload: evt,
        },
    )
    .filter((evt): evt is PlayerCuePoint<TimecodeEventWithType> => !!evt) ||
  undefined;

const convertChaptersToPlayerChapters = (
  chapterListing: Maybe<ChapterListing> | undefined,
) =>
  chapterListing?.objects
    ?.map((chapter): PlayerChapter<TimecodeEventWithType> | null =>
      chapter && typeof chapter.start_time === "number"
        ? {
            uid: chapter.uid,
            title: chapter.title ? chapter.title : undefined,
            startTime: chapter.start_time,
            cuePoints: convertTimecodeEventsToPlayerCuePoints(
              chapter.timecode_events,
            ),
          }
        : null,
    )
    .filter(
      (chapter): chapter is PlayerChapter<TimecodeEventWithType> => !!chapter,
    ) || undefined;

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
  audienceRating,
  budget,
  brand,
  season,
  credits,
  availabilityEndDate,
}) => {
  const { t, lang } = useTranslation("common");

  const { data: asset } = useObject<SkylarkAsset>(GET_ASSET, player.assetId);

  const { playbackTokens } = useMuxPlaybackTokens(
    player.provider,
    player.playbackId,
  );

  const { cuePoints, chapters } = useMemo(
    () => ({
      cuePoints: convertTimecodeEventsToPlayerCuePoints(asset?.timecode_events),
      chapters: convertChaptersToPlayerChapters(asset?.chapters),
    }),
    [asset],
  );

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

  const strBudget = (
    typeof budget === "string" ? budget : budget?.toString()
  )?.trim();

  const metadataPanelContent = [
    {
      icon: <MdStar />,
      header: t("audience-rating"),
      body: convertAudienceRatingToStars(audienceRating),
    },
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
    {
      icon: <MdMoney />,
      header: t("budget"),
      body:
        strBudget && strBudget !== "0"
          ? `$${strBudget.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
          : undefined,
    },
  ];

  const [activeChapter, setActiveChapter] =
    useState<PlayerChapter<TimecodeEventWithType> | null>(null);
  const [activeCuePoint, setActiveCuePoint] =
    useState<PlayerCuePoint<TimecodeEventWithType> | null>(null);
  const [pauseTime, setPauseTime] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-900 pb-20 font-body md:pt-64">
      <SkeletonPage show={!!loading}>
        <div className="flex h-full w-full justify-center">
          <Player
            autoPlay={player.autoPlay}
            chapters={chapters}
            cuePoints={cuePoints}
            pauseOverlay={
              pauseTime && (
                <PlayerPauseOverlay
                  chapter={activeChapter || chapters?.[0] || null}
                  timestamp={pauseTime}
                />
              )
            }
            playbackId={player.playbackId}
            playbackTokens={playbackTokens}
            poster={player.poster}
            provider={player.provider}
            src={player.src}
            videoId={player.assetId}
            videoTitle={title}
            onChapterChange={(c) => {
              console.log("Active Chapter Changed:", c);
              setActiveChapter(c);
            }}
            onCuePointChange={(p) => {
              console.log("Active Cue Point Changed:", p);
              if (
                p?.payload.type &&
                [
                  TimecodeEventType.Advertlink,
                  TimecodeEventType.Advertcontextual,
                ].includes(p.payload.type)
              ) {
                setActiveCuePoint(p);
              }
            }}
            onPlayToggle={({ type, currentTime }) =>
              setPauseTime(type === "pause" ? currentTime : null)
            }
          />
        </div>
        <div className="mb-8 flex h-64 w-full flex-col items-center border-b border-gray-800 bg-gray-900 md:mb-16">
          <div className="my-8 rounded sm:w-11/12 lg:w-3/4">
            <PlayerTimecodeEvent
              payload={activeCuePoint?.payload || cuePoints?.[0]?.payload}
            />
          </div>
        </div>
        <div className="flex w-full flex-col px-gutter sm:px-sm-gutter lg:px-lg-gutter xl:px-xl-gutter">
          <div className="flex w-full flex-col md:flex-row md:py-2">
            <div className="h-full w-full pb-4 md:w-7/12">
              <InformationPanel
                actors={credits?.Actor?.formattedCredits}
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
                content={metadataPanelContent.filter(({ body }) =>
                  Array.isArray(body)
                    ? body.length > 0
                    : React.isValidElement(body) || typeof body === "string",
                )}
              />
            </div>
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
