import React from "react";
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
import { Dayjs } from "dayjs";
import { NextPage } from "next";
import { getTimeFromNow } from "../../../lib/utils";
import { ListPersonOtherCreditsRail } from "../../rails";
import { InformationPanel } from "../../generic/information-panel";
import { MetadataPanel } from "../../generic/metadata-panel";
import { Player } from "../../generic/player";
import { SkeletonPage } from "../../generic/skeleton";
import { Link } from "../../generic/link";

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
          <div className="h-full w-full pt-4 md:w-5/12 ltr:pl-1 ltr:sm:pl-5 rtl:pr-1 rtl:sm:pr-5">
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
