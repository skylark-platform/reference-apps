import React from "react";
import { MdVideoLibrary } from "react-icons/md";
import { List } from "../list";

interface BrandHeaderProps {
  title: string;
  numberOfSeasons: number;
  releaseDate?: string;
  rating: string;
  description?: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  title,
  numberOfSeasons,
  releaseDate,
  rating,
  description,
}) => (
  <div className="w-full text-white sm:w-2/3 md:w-3/5 lg:w-1/2 xl:w-1/3">
    <div className="left flex w-full flex-col gap-3">
      <div className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl">
        {title}
      </div>
      <div className="flex">
        <List
          contents={[
            numberOfSeasons ? (
              <span className="flex items-center" key={"duration-icon"}>
                <MdVideoLibrary className="mt-0 mr-2 h-6 w-7" />
                {`${numberOfSeasons} ${
                  numberOfSeasons > 1 ? "Seasons" : "Season"
                }`}
              </span>
            ) : undefined,
            releaseDate,
            rating,
          ]}
          highlightFirst
          textSize={"sm"}
        />
      </div>
      {description && (
        <p className="mb-5 text-sm text-gray-400 md:text-base lg:text-lg">
          {description}
        </p>
      )}
    </div>
  </div>
);

export default BrandHeader;
