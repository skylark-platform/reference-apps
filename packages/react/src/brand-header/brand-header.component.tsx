import React from "react";
import { MdVideoLibrary } from "react-icons/md";
import { List } from "../list";

interface BrandHeaderProps {
  show: string;
  numberOfSeasons: number;
  releaseYear: number;
  ageRange: string;
  description: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  show,
  numberOfSeasons,
  releaseYear,
  ageRange,
  description,
}) => (
  <div className="bg-black md:w-6/12">
    <div className="p-2	text-white" key={show}>
      <div className="left flex w-full flex-col gap-3">
        <div className="pl-1 text-2xl md:text-4xl">{show}</div>
        <div className="flex">
          <List
            contents={[
              <span className="flex items-center" key={"duration-icon"}>
                <MdVideoLibrary className="mt-0 mr-2 h-6 w-7" />
                {`${numberOfSeasons} ${
                  numberOfSeasons > 1 ? "Seasons" : "Season"
                }`}
              </span>,
              releaseYear,
              ageRange,
            ]}
            highlightFirst
            textSize={"sm"}
          />
        </div>
        <div className="mb-5 text-lg text-gray-400">{description}</div>
      </div>
    </div>
  </div>
);

export default BrandHeader;
