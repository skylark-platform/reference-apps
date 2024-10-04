import React from "react";
import { MdVideoLibrary, MdLocalMovies } from "react-icons/md";
import { IconBaseProps } from "react-icons";
import useTranslation from "next-translate/useTranslation";
import { List } from "../list";
import { formatYear } from "../../../lib/utils";
import { EntertainmentType } from "../../../lib/interfaces";

interface HeaderProps {
  title: string;
  numberOfItems: number;
  typeOfItems: EntertainmentType;
  releaseDate?: string;
  rating?: string;
  description?: string;
  tags?: string[];
}

const Icon = ({
  typeOfItems,
  ...rest
}: { typeOfItems: EntertainmentType } & IconBaseProps) => {
  switch (typeOfItems) {
    case "season":
      return <MdVideoLibrary {...rest} />;
    case "movie":
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
  tags,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="mb-5 w-full text-white sm:w-2/3 md:w-3/5 xl:w-1/2">
      <div className="left flex w-full flex-col gap-3">
        <h1 className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl">
          {title}
        </h1>
        <div className="flex">
          <List
            contents={[
              typeOfItems && numberOfItems ? (
                <span className="flex items-center" key={"duration-icon"}>
                  <Icon
                    className="mt-0 h-6 w-7 ltr:mr-2 rtl:ml-2"
                    typeOfItems={typeOfItems}
                  />
                  {t(`skylark.object.count.${typeOfItems}`, {
                    count: numberOfItems,
                  })}
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
          <p className="text-sm text-gray-400 md:text-base lg:text-lg">
            {description}
          </p>
        )}
        {tags && <List contents={tags} textSize={"sm"} />}
      </div>
    </div>
  );
};

export default Header;
