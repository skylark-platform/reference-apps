import React, { useState } from "react";
import { MdPlayArrow, MdPause } from "react-icons/md";

interface MediaPlayerContentProps {
  inProgress: boolean;
  season: number;
  episodeNumber: number;
  episodeName: string;
}

export const MediaPlayerContent: React.FC<MediaPlayerContentProps> = ({
  inProgress,
  season,
  episodeNumber,
  episodeName,
}) => {
  const [play, isPlay] = useState(inProgress);

  return (
    <div className="w-full bg-black text-sm text-white md:w-5/12 lg:w-2/12">
      <div className="flex items-center">
        <div
          className="m-1 rounded-full border border-0 bg-button-primary p-5"
          onClick={() => isPlay(!play)}
        >
          {play ? <MdPlayArrow size={30} /> : <MdPause size={30} />}
        </div>
        <div className="flex flex-col pl-2">
          <span className="font-semibold">
            {play ? "Start Watching" : "Pause Watching"}
          </span>
          <span className="pt-1 text-gray-300">{`S${season} : E${episodeNumber} - ${episodeName}`}</span>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayerContent;
