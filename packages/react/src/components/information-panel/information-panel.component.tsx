import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { MdOutlineWatchLater } from "react-icons/md";
import { List } from "../list";

interface InformationPanelProps {
  brand?: {
    title: string;
  };
  season?: {
    title?: string;
    number?: string | number;
  };
  title: string;
  duration: number;
  rating?: string;
  availableUntil: number;
  description?: string;
  genres?: string[];
  themes?: string[];
}

export const InformationPanel: React.FC<InformationPanelProps> = ({
  brand,
  season,
  title,
  duration,
  rating,
  availableUntil,
  description,
  genres,
  themes,
}) => {
  const [isExpanded, setExpand] = useState(false);
  const [isTrunicated, setTrunicated] = useState(false);
  const { t } = useTranslation("common");

  const setTrunicatedWrapper = (el: HTMLParagraphElement) => {
    const trunc = !!(el && el.clientHeight < el.scrollHeight);
    setTrunicated(trunc);
  };
  return (
    <div className="h-full w-full bg-gray-900">
      <div className="p-2 text-white">
        <div className="left flex w-full flex-col gap-3">
          {brand && (
            <div className="hidden md:flex">
              <List
                contents={
                  [
                    brand.title,
                    season
                      ? season.title ||
                        (season.number &&
                          `${t("skylark.object.season")} ${season.number}`)
                      : "",
                  ] || []
                }
                highlightAll
                textSize={"lg"}
              />
            </div>
          )}
          <h1 className="pt-2 text-2xl md:text-3xl">{title}</h1>
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
              t("available-for", { days: availableUntil }),
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
                  {isExpanded ? t("show-less") : t("show-more")}
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
