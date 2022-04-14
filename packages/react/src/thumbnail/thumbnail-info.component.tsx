import React from "react";
import { MdCircle } from "react-icons/md";
import { H4 } from "../typography";

export interface ThumbnailContentProps {
  title: string;
  subtitle?: string;
  tags?: string[];
  thinText?: boolean;
}

export const ThumbnailContent: React.FC<ThumbnailContentProps> = ({
  title,
  subtitle,
  tags,
  thinText,
}) => (
  <>
    <H4
      className={`text-white ${
        thinText ? "font-normal" : "font-semibold"
      } mb-1`}
    >
      {title}
    </H4>
    <div className="flex flex-row items-center">
      <p
        className={`text-sm ${
          thinText ? "font-thin" : "font-light"
        } text-white`}
      >
        {subtitle}
      </p>
      {tags &&
        tags.map((tag) => (
          <>
            <MdCircle className="mx-2 h-1 w-1 text-gray-400" />
            <p
              className={`text-sm ${
                thinText ? "font-thin" : "font-light"
              } text-gray-400 transition-colors group-hover:text-white`}
              key={tag}
            >
              {tag}
            </p>
          </>
        ))}
    </div>
  </>
);
