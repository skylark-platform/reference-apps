import { formatReleaseDate } from "@skylark-reference-apps/lib";
import clsx from "clsx";
import Link from "next/link";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { MdOutlineRotateRight, MdClear, MdSearch } from "react-icons/md";
import { useDebounce } from "use-debounce";
import { sanitize } from "dompurify";
import { sentenceCase } from "sentence-case";

import { useSearch } from "../hooks/useSearch";
import {
  convertGraphQLSetType,
  convertTypenameToObjectType,
  getGraphQLImageSrc,
} from "../lib/utils";
import { ImageType, Maybe } from "../types";

const findMatchOrReturnFirst = (
  strings: (string | Maybe<string> | undefined)[]
): string => {
  const filteredStrings = strings.filter((str) => !!str) as string[];
  return (
    filteredStrings.find((str) => str.includes("skylark-search-highlight")) ||
    filteredStrings?.[0] ||
    ""
  );
};

// At the moment, Skylark cannot highlight the Object Type even if it is the search's match
// We can manually override this behaviour by checking the query
const highlightTypenameIfInSearchQuery = (
  query: string,
  objectType: string
) => {
  const regEx = new RegExp(query, "ig");
  return sentenceCase(objectType).replace(
    regEx,
    `<span class="skylark-search-highlight">$&</span>`
  );
};

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

// Skylark Search is able to highlight the matches in a search response by adding <span></span> around a match
// We need to parse this tag to display it to the user, but we don't want to assume all the HTML is valid and not XSS
const HighlightedSearchResultText = ({
  text,
  className,
  matchClassName,
}: {
  text: string;
  className?: string;
  matchClassName?: string;
}) => {
  const cleanHTML = sanitize(text, { ALLOWED_TAGS: ["span"] });
  return (
    <p
      className={clsx(
        className,
        matchClassName,
        "[&>span]:text-pink-500 group-hover:[&>span]:text-purple-400 [&>span]:transition-colors"
      )}
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
};

const SearchResultItem = ({
  title,
  description,
  href,
  date,
  image,
  typename,
  onClick,
}: {
  title: string;
  description: string;
  href: string;
  date: string;
  image: string;
  typename: string;
  onClick: () => void;
}) => (
  <Link href={href}>
    <a
      className="group mb-4  grid grid-cols-[4fr_1fr] items-center gap-4 last:mb-0"
      onClick={() => onClick()}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-col">
          <HighlightedSearchResultText
            className="text-lg font-medium text-gray-100 transition-colors group-hover:text-purple-400"
            matchClassName="[&>span]:font-bold"
            text={title}
          />
          {description && (
            <HighlightedSearchResultText
              className="text-sm text-gray-400 transition-colors line-clamp-3 group-hover:text-purple-400"
              matchClassName="[&>span]:font-semibold"
              text={description}
            />
          )}
        </div>
        <div className="flex flex-row justify-between gap-2 text-sm text-gray-600 transition-colors group-hover:text-purple-400">
          <HighlightedSearchResultText
            matchClassName="[&>span]:font-semibold"
            text={typename}
          />
          {date && <p>{formatReleaseDate(date)}</p>}
        </div>
      </div>
      {image && (
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={title}
            className="h-auto max-h-[4rem] w-auto max-w-full"
            src={image}
          />
        </div>
      )}
    </a>
  </Link>
);

export const Search = ({ onSearch }: { onSearch?: () => void }) => {
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const onFocus = () => setSearchResultsOpen(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000);

  const { data, isLoading } = useSearch(debouncedSearchQuery);

  const clearSearchQuery = () => setSearchQuery("");
  const onSearchWrapper = () => {
    onSearch?.();
    clearSearchQuery();
  }

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setSearchResultsOpen(false);
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-start pt-[16vh] md:relative md:block md:pt-0"
      ref={ref}
      onFocus={onFocus}
    >
      <div
        className={clsx(
          "flex items-center bg-purple-500/90 justify-center rounded-full border-0 border-gray-300 md:bg-button-tertiary p-3 px-4  transition-colors focus-within:border-white  focus-within:text-white",
          searchQuery ? "text-white" : "text-gray-300"
        )}
      >
        <input
          className={clsx(
            "w-full border-none bg-transparent px-2 py-0 shadow-none outline-none ring-0 placeholder:text-gray-300 focus:border-none focus:shadow-none focus:outline-none focus:ring-0 focus:placeholder:text-white focus-visible:border-none focus-visible:outline-none md:w-44"
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
      {searchResultsOpen && searchQuery && (
        <div className="right-0 z-100 mt-2 md:absolute">
          <div className="md:max-h-[24rem] max-h-[70vh] min-h-[2rem] w-[94vw] overflow-y-auto rounded bg-gray-800 px-4 py-6 md:px-8 md:py-8 md:w-[34rem]">
            {(isLoading || data?.objects?.length === 0) && (
              <p className="text-lg font-medium text-gray-100">
                {isLoading ? "Loading..." : "Nothing found"}
              </p>
            )}
            {!isLoading &&
              data?.objects?.map((obj) => {
                const typename = obj.__typename;
                const parsedType = convertTypenameToObjectType(typename);
                const href = `/${parsedType}/${obj.uid}`;

                if (typename === "Person") {
                  return (
                    <SearchResultItem
                      date={(obj.date_of_birth as string) || ""}
                      description={findMatchOrReturnFirst([
                        obj.bio_short,
                        obj.bio_medium,
                        obj.bio_long,
                      ])}
                      href={href}
                      image={getGraphQLImageSrc(obj?.images, ImageType.Main)}
                      key={obj.uid}
                      title={obj.name || ""}
                      typename={highlightTypenameIfInSearchQuery(
                        searchQuery,
                        typename
                      )}
                      onClick={onSearchWrapper}
                    />
                  );
                }

                if (typename === "SkylarkSet") {
                  const setHref = `${convertGraphQLSetType(obj?.type || "")}/${
                    obj.uid
                  }`;
                  return (
                    <SearchResultItem
                      date={(obj.release_date as string) || ""}
                      description={findMatchOrReturnFirst([
                        obj.synopsis_short,
                        obj.synopsis,
                      ])}
                      href={setHref}
                      image={getGraphQLImageSrc(
                        obj?.images,
                        ImageType.Thumbnail
                      )}
                      key={obj.uid}
                      title={findMatchOrReturnFirst([
                        obj.title_short,
                        obj.title,
                      ])}
                      typename={sentenceCase(obj.type || "")}
                      onClick={onSearchWrapper}
                    />
                  );
                }

                if (
                  typename === "Brand" ||
                  typename === "Episode" ||
                  typename === "Movie"
                ) {
                  return (
                    <SearchResultItem
                      date={(obj.release_date as string) || ""}
                      description={findMatchOrReturnFirst([
                        obj.synopsis_short,
                        obj.synopsis,
                      ])}
                      href={href}
                      image={getGraphQLImageSrc(
                        obj?.images,
                        ImageType.Thumbnail
                      )}
                      key={obj.uid}
                      title={findMatchOrReturnFirst([
                        obj.title_short,
                        obj.title,
                      ])}
                      typename={highlightTypenameIfInSearchQuery(
                        searchQuery,
                        typename
                      )}
                      onClick={onSearchWrapper}
                    />
                  );
                }

                return <Fragment key={obj.uid} />;
              })}
          </div>
        </div>
      )}
    </div>
  );
};
