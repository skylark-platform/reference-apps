import React from "react";
import { MdOutlineWatchLater } from "react-icons/md";
import { List } from "../list";

interface InformationPanelProps {
  parentTitles?: string[];
  title: string;
  seasonNumber?: string | number;
  duration: number;
  rating?: string;
  availableUntil: number;
  description?: string;
  genres?: string[];
  themes?: string[];
}

export const InformationPanel: React.FC<InformationPanelProps> = ({
  parentTitles,
  title,
  duration,
  rating,
  availableUntil,
  description,
  genres,
  themes,
  seasonNumber,
}) => (
  <div className="h-full w-full bg-gray-900">
    <div className="p-2 text-white">
      <div className="left flex w-full flex-col gap-3">
        {parentTitles && (
          <div className="hidden md:flex">
            <List
              contents={
                [
                  ...parentTitles,
                  seasonNumber ? `Season ${seasonNumber}` : "",
                ] || []
              }
              highlightAll
              textSize={"lg"}
            />
          </div>
        )}
        <div className="pt-2 text-2xl md:text-3xl">{title}</div>
        <span className="mt-4 mb-2 hidden w-2/12 border-b border-gray-800 md:flex" />
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
        {description && (
          <p className="mb-5 pt-2 text-sm text-gray-400 md:text-base">
            {description}
          </p>
        )}
        {[genres, themes].map(
          (contents) =>
            contents && (
              <div className="-my-0.5 text-gray-500" key={contents?.join("")}>
                <List contents={contents} />
              </div>
            )
        )}
      </div>
    </div>
  </div>
);

export default InformationPanel;
