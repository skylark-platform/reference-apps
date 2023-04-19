import { formatReleaseDate } from "@skylark-reference-apps/lib";
import clsx from "clsx";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { MdOutlineRotateRight, MdClear, MdSearch } from "react-icons/md";
import { useDebounce } from "use-debounce";
import { useSearch } from "../hooks/useSearch";
import { convertTypenameToObjectType } from "../lib/utils";

const SearchIcon = ({
  searchQuery,
  isLoading,
  onClearClick,
}: {
  searchQuery: string;
  isLoading: boolean;
  onClearClick: () => void;
}) => {
  const sharedClassName = "text-2xl";

  if (!searchQuery) {
    return <MdSearch className={sharedClassName} />;
  }

  if (searchQuery && !isLoading) {
    return (
      <button className={sharedClassName} onClick={onClearClick}>
        <MdClear />
      </button>
    );
  }

  return (
    <MdOutlineRotateRight className={clsx(sharedClassName, "animate-spin")} />
  );
};

const SearchResultItem = ({
  title,
  description,
  href,
  date,
  typename,
  onClick
}: {
  title: string;
  description: string;
  href: string;
  date: string;
  typename: string;
  onClick: () => void;
}) => (
    <Link href={href}>
      <a
        className="group mb-4 flex flex-col last:mb-0"
        onClick={onClick}
      >
        <p className="text-lg font-medium text-gray-100 transition-colors group-hover:text-purple-400">
          {title}
        </p>
        <p className="text-sm text-gray-400 transition-colors line-clamp-2 group-hover:text-purple-400">
          {description}
        </p>
        <div className="flex flex-row justify-between gap-2 text-sm text-gray-600 transition-colors group-hover:text-purple-400">
          <p>{typename}</p>
          {date && (
            <p>{formatReleaseDate(date)}</p>
          )}
        </div>
      </a>
    </Link>
  );

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000);

  const { data, isLoading } = useSearch(debouncedSearchQuery);

  const clearSearchQuery = () => setSearchQuery("")

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-start bg-purple-500/95 pt-[25vh] md:relative md:block md:pt-0">
      <div
        className={clsx(
          "flex items-center justify-center rounded-full border-0 border-gray-300 bg-button-tertiary p-3 px-4  transition-colors focus-within:border-white  focus-within:text-white",
          searchQuery ? "text-white" : "text-gray-300"
        )}
      >
        <input
          className={clsx(
            "w-5/6 border-none bg-transparent px-2 py-0 shadow-none outline-none ring-0 placeholder:text-gray-300 focus:border-none focus:shadow-none focus:outline-none focus:ring-0 focus:placeholder:text-white focus-visible:border-none focus-visible:outline-none md:w-44"
          )}
          placeholder="Search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon
          isLoading={isLoading}
          searchQuery={searchQuery}
          onClearClick={clearSearchQuery}
        />
      </div>
      {searchQuery && (
        <div className="right-0 z-100 mt-2 md:absolute">
          <div className="max-h-[24rem] min-h-[2rem] w-[90vw] overflow-y-auto rounded bg-gray-800 py-8 px-8 md:w-[30rem]">
            {(isLoading || data?.objects.length === 0) && (
              <p className="text-lg font-medium text-gray-100">
                {isLoading ? "Loading..." : "Nothing found"}
              </p>
            )}
            {!isLoading &&
              data?.objects?.map((obj) => {
                const typename = obj.__typename;
                const parsedType = convertTypenameToObjectType(typename);
                const href = `/${parsedType}/${obj.uid}`;

                if(typename === "Person") {
                  return (
                    <SearchResultItem
                      date={obj.date_of_birth as string || ""}
                      description={obj.bio_short || obj.bio_medium || obj.bio_long || ""}
                      href={href}
                      key={obj.uid}
                      title={(obj.alias && obj.name) ? `${obj.name} (${obj.alias})` : obj.name || ""}
                      typename={typename}
                      onClick={clearSearchQuery}
                    />
                  )
                }

                if(typename === "Brand" || typename === "Episode" || typename === "Movie") {

                  return (
                    <SearchResultItem
                      date={obj.release_date as string || ""}
                      description={obj.synopsis_short || obj.synopsis || ""}
                      href={href}
                      key={obj.uid}
                      title={obj.title || obj.title_short || ""}
                      typename={typename}
                      onClick={clearSearchQuery}
                    />
                  );
                }

                return <Fragment key={obj.uid} />
              })}
          </div>
        </div>
      )}
    </div>
  );
};
