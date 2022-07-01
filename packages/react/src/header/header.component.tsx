import React from "react";
import { formatYear } from "@skylark-reference-apps/lib";
import { MdVideoLibrary, MdLocalMovies } from "react-icons/md";
import { IconBaseProps } from "react-icons";
import { List } from "../list";

interface HeaderProps {
  title: string;
  numberOfItems: number;
  typeOfItems: "Seasons" | "Movies";
  releaseDate?: string;
  rating: string;
  description?: string;
}

const Icon = ({
  typeOfItems,
  ...rest
}: { typeOfItems: string } & IconBaseProps) => {
  switch (typeOfItems) {
    case "Seasons":
      return <MdVideoLibrary {...rest} />;
    case "Movies":
      return <MdLocalMovies {...rest} />;
    default:
      return <MdVideoLibrary {...rest} />;
  }
};

export const Header: React.FC<HeaderProps> = ({
  title,
  numberOfItems,
  typeOfItems,
  releaseDate,
  rating,
  description,
}) => (
  <div className="w-full text-white sm:w-2/3 md:w-3/5 xl:w-1/2">
    <div className="left flex w-full flex-col gap-3">
      <div className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl">
        {title}
      </div>
      <div className="flex">
        <List
          contents={[
            numberOfItems ? (
              <span className="flex items-center" key={"duration-icon"}>
                <Icon className="mt-0 mr-2 h-6 w-7" typeOfItems={typeOfItems} />
                {`${numberOfItems} ${
                  numberOfItems > 1 ? typeOfItems : typeOfItems.slice(0, -1)
                }`}
              </span>
            ) : undefined,
            formatYear(releaseDate),
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

export default Header;
