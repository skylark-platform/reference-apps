import React from "react";
import { MdCircle } from "react-icons/md";

export interface ListProps {
  contents: (string | undefined)[];
  highlightFirst?: boolean;
  textSize?: "xs" | "sm" | "base" | "lg";
}

export const List: React.FC<ListProps> = ({
  contents,
  highlightFirst,
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
              ${highlightFirst && index === 0 ? "text-white" : "text-gray-400"}
              ${textSize ? `text-${textSize}` : "text-xs"}
              font-normal transition-colors
              group-hover:text-white md:text-sm
            `}
          >
            {text}
          </p>
        </React.Fragment>
      ))}
  </div>
);

export default List;
