import React from "react";
import { MdOutlineWatchLater } from "react-icons/md";
import { List } from "../list";

interface InformationPanelProps {
  show: string;
  season: number;
  episode: string;
  duration: number;
  rating?: string;
  availableUntil: number;
  description?: string;
  genres?: string[];
}

export const InformationPanel: React.FC<InformationPanelProps> = ({
  show,
  season,
  episode,
  duration,
  rating,
  availableUntil,
  description,
  genres,
}) => (
  <div className="h-full w-full bg-gray-900">
    <div className="p-2 text-white" key={show}>
      <div className="left flex w-full flex-col gap-3">
        <div className="hidden md:flex">
          <List
            contents={[show, `Season ${season}`]}
            highlightAll
            textSize={"lg"}
          />
        </div>
        <div className="pt-2 text-2xl md:text-3xl">{episode}</div>
        <span className="mt-4 mb-2 hidden w-2/12 border-b border-b-[1px] border-gray-800 md:flex" />
        <div className="flex">
          <List
            contents={[
              <span className="flex items-center" key={"duration-icon"}>
                <MdOutlineWatchLater className="mt-0 mr-2" size={25} />
                {`${duration}m`}
              </span>,
              rating,
              `Available for ${availableUntil} days`,
            ]}
            highlightFirst
            textSize={"sm"}
          />
        </div>
        {description && (
          <p className="text-md mb-5 pt-2 text-gray-400">{description}</p>
        )}
        {genres && (
          <div className="text-gray-500">
            <List contents={genres} />
          </div>
        )}
      </div>
    </div>
  </div>
);

export default InformationPanel;
