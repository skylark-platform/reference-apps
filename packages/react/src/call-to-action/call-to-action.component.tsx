import useTranslation from "next-translate/useTranslation";
import React from "react";
import { MdPlayArrow } from "react-icons/md";
import { Button } from "../button";
import { List } from "../list";

interface CallToActionProps {
  inProgress: boolean;
  seasonNumber: number;
  episodeNumber: number;
  episodeTitle?: string;
  href: string;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  inProgress,
  seasonNumber,
  episodeNumber,
  episodeTitle,
  href,
}) => {
  const parsedSeasonNum = seasonNumber ? `S${seasonNumber}` : "";
  const parsedEpisodeNum = episodeNumber ? `E${episodeNumber}` : "";
  const { t } = useTranslation("common");

  return (
    <div className="flex w-full items-center py-2 text-sm text-white md:text-base lg:text-lg">
      <Button href={href} icon={<MdPlayArrow size={30} />} size="xl" />
      <div className="flex flex-col pl-3">
        <span className="pb-1 font-medium">
          {inProgress ? t("cta.continue-watching") : t("cta.start-watching")}
        </span>
        <List
          contents={[
            parsedSeasonNum && parsedEpisodeNum
              ? `${parsedSeasonNum} : ${parsedEpisodeNum}`
              : parsedSeasonNum || parsedEpisodeNum,
            episodeTitle,
          ]}
          textSize={"sm"}
        />
      </div>
    </div>
  );
};

export default CallToAction;
