import React from "react";
import { MdCircle } from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";

interface InformationPanelProps {
  content: {
    show: string;
    season: number;
    episode: string;
    duration: number;
    ageRange: string;
    availableUntil: number;
    description: string;
    genre: string | string[];
  }[];
}

export const InformationPanel: React.FC<InformationPanelProps> = ({
  content,
}) => (
  <div className="w-full bg-black ">
    {content.map(
      ({
        show,
        season,
        episode,
        duration,
        ageRange,
        availableUntil,
        description,
        genre,
      }) => (
        <div className="p-2	 text-white " key={show}>
          <div className="left grid w-full grid-cols-8	gap-3 ">
            <div className="col-span-9 col-start-1  hidden md:flex">
              {`${show}`}
              <MdCircle className="mt-3 h-1 text-gray-500" />
              <div>{`Season ${season}`}</div>
            </div>
            <div className="col-span-9 pt-2 text-2xl md:text-3xl">{`${episode}`}</div>
            <span className="col-span-3 col-start-1 mt-4 mb-2 hidden w-1/2 border-b border-b-[1px] border-gray-800 md:flex" />
            <div className="col-span-9 flex ">
              <AiOutlineClockCircle className="mt-0 mr-2 h-6 w-7 " />
              {`${duration}m`}
              <MdCircle className="mt-3 h-1 text-gray-500" />
              {ageRange}
              <MdCircle className="mt-3 h-1 text-gray-500" />
              {`Available for ${availableUntil} days`}
            </div>
            <div className="col-span-9 mb-5 pt-2 text-lg	text-gray-400">
              {description}
            </div>
            <div className="col-span-9 flex text-gray-500">
              {genre && Array.isArray(genre)
                ? genre.map((genreTwo) => (
                    <div className="flex" key={genreTwo}>
                      {genreTwo} <MdCircle className="mt-3 h-1" />
                    </div>
                  ))
                : genre}
            </div>
          </div>
        </div>
      )
    )}
  </div>
);

export default InformationPanel;
