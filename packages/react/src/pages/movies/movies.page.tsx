import { formatYear } from "@skylark-reference-apps/lib";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { Dropdown, H4, SkeletonPage, MovieThumbnail } from "../../components";

export interface MoviesPageParsedMovie {
  slug: string;
  uid: string;
  title: string;
  image: string;
  href: string;
  duration?: string;
  releaseDate?: string;
}

interface Props {
  loading?: boolean;
  onGenreChange?: (uid: string) => void;
  movies: {
    slug: string;
    self: string;
  }[];
  genres?: string[];
  MovieDataFetcher: React.FC<{
    slug: string;
    self: string;
    children(data: MoviesPageParsedMovie): React.ReactNode;
  }>;
}

export const MoviesPage: React.FC<Props> = ({
  loading,
  genres,
  movies,
  onGenreChange,
  MovieDataFetcher,
}) => {
  const [genre, setGenre] = useState("");
  const { t } = useTranslation("common");

  const updateGenre = (newGenre: string) => {
    setGenre(newGenre);
    onGenreChange?.(newGenre);
  };

  return (
    <div className="flex w-full flex-col justify-center bg-gray-900 py-20 font-body">
      <div className="px-gutter sm:px-sm-gutter md:pt-20 lg:px-lg-gutter xl:px-xl-gutter">
        <div className="my-10 text-white">
          <h1 className="text-[40px] font-medium md:text-[56px]">
            {t("movies")}
          </h1>
          <div className="text-[16px]">{t("movies-page-description")}</div>
        </div>
        <div className="flex flex-row gap-x-2 pb-8 md:pb-20 xl:pb-24">
          <Dropdown
            items={genres || []}
            label="Genres"
            onChange={updateGenre}
          />
        </div>
      </div>
      {!movies ||
        (movies.length === 0 && (
          <div className="text-center">
            <H4 className="mt-2 mb-0.5 text-white">{`No movies found for Genre: ${genre}`}</H4>
          </div>
        ))}
      <SkeletonPage show={!!loading}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-gutter sm:px-sm-gutter md:grid-cols-3 lg:grid-cols-4 lg:px-lg-gutter xl:px-xl-gutter 2xl:grid-cols-6">
          {movies?.map(({ self, slug }) => (
            <MovieDataFetcher key={`movie-${slug}`} self={self} slug={slug}>
              {(movie: MoviesPageParsedMovie) => (
                <MovieThumbnail
                  backgroundImage={movie.image}
                  contentLocation="below"
                  duration={movie.duration}
                  href={movie.href}
                  key={movie.uid}
                  releaseDate={formatYear(movie.releaseDate)}
                  title={movie.title}
                />
              )}
            </MovieDataFetcher>
          ))}
        </div>
      </SkeletonPage>
    </div>
  );
};
