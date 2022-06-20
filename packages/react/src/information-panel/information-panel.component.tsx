import React, { useState } from "react";
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
}) => {
  const [isExpanded, setExpand] = useState(false);
  const [isTrunicated, setTrunicated] = useState(false);

  const setTrunicatedWrapper = (el: HTMLParagraphElement) => {
    const trunc = !!(el && el.clientHeight < el.scrollHeight);
    setTrunicated(trunc);
  };
  return (
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
          <span className="mt-4 mb-2 hidden w-36 border-b border-gray-800 md:flex" />
          <List
            contents={[
              <span
                className="flex items-center"
                key={`duration-icon-for-${title}`}
              >
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
            <div className="mb-5 pt-2 text-sm text-gray-400 md:text-base">
              <p
                className={`${isExpanded ? "line-clamp-none" : "line-clamp-4"}`}
                ref={setTrunicatedWrapper}
              >
                {description}
              </p>
              {(isTrunicated || isExpanded) && (
                <button
                  className="font-semibold underline"
                  onClick={() => setExpand(!isExpanded)}
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}
          {[
            { key: "genres", items: genres },
            { key: "themes", items: themes },
          ].map(
            ({ key, items }) =>
              items && (
                <div
                  className="-my-0.5 text-gray-500"
                  key={`${key}-${items?.join("")}`}
                >
                  <List contents={items} />
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default InformationPanel;
