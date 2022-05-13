import React from "react";
import { MdCircle } from "react-icons/md";

export interface ListProps {
  contents: (string | undefined | JSX.Element)[];
  highlightFirst?: boolean;
  highlightAll?: boolean;
  textSize?: "xs" | "sm" | "base" | "lg";
}

export const List: React.FC<ListProps> = ({
  contents,
  highlightFirst,
  highlightAll,
  textSize,
}) => (
  <div className="my-0.5 flex flex-row items-center text-gray-400">
    {contents
      .filter((el) => !!el)
      .map((text, index) => (
        <React.Fragment key={`list-${text as string}`}>
          {index !== 0 && <MdCircle className="mx-2 h-1 w-1 text-gray-400" />}
          <p
            className={`
              ${
                (highlightFirst && index === 0) || highlightAll
                  ? "text-white"
                  : "text-gray-400"
              }
              ${textSize ? `text-${textSize}` : "text-xs"}
              font-normal transition-colors
              group-hover:text-white
            `}
          >
            {text}
          </p>
        </React.Fragment>
      ))}
  </div>
);

export default List;
