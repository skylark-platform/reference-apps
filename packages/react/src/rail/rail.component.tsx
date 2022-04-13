import React from "react";
import { MdArrowForward, MdArrowBack } from "react-icons/md";
import { Thumbnail, ThumbnailProps } from "../thumbnail";

interface RailProps {
  thumbnails: ThumbnailProps[]
}

const directionArrowClassName = "absolute h-[calc(100%-0.5rem)] w-20 bg-gray-900/[.3] text-3xl flex justify-center items-center text-white";

export const Rail: React.FC<RailProps> = ({ thumbnails }) => (
  <div className="w-full">
    <div className="overflow-x-scroll px-2 relative flex justify-center items-center">
      <button className={`left-0 ${directionArrowClassName}`}>
        <MdArrowBack />
      </button>
      <button className={`right-0 ${directionArrowClassName}`}>
        <MdArrowForward />
      </button>
      <div className="flex flex-row w-full overflow-x-scroll overflow-y-visible py-1 px-20">
        {thumbnails.map((props) => (
          <div className="w-1/4 min-w-[25%] hover:scale-105 transition-all hover:z-50 px-2" key={props.title}>
            <Thumbnail {...props} />
          </div>
        ))}
      </div>
    </div>
  </div>
  );

export default Rail;
