import { ReactNode, useState } from "react";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  MoviesPageParsedMovie,
  MoviesPage,
} from "@skylark-reference-apps/react";
import useTranslation from "next-translate/useTranslation";
import { sortArrayIntoAlphabeticalOrder } from "@skylark-reference-apps/lib";
import { useMovieListing } from "../hooks/useMovieListing";
import { MediaObjectFetcher } from "../components/mediaObjectFetcher";
import { Genre, ImageType, Movie } from "../types/gql";
import { useGenreListing } from "../hooks/useGenreListing";
import { useMovieListingFromGenre } from "../hooks/useMovieListingFromGenre";
import {
  getGraphQLImageSrc,
  getTitleByOrderForGraphQLObject,
} from "../lib/utils";

const MovieDataFetcher: React.FC<{
  uid: string;
  children(data: MoviesPageParsedMovie): ReactNode;
}> = ({ uid, children }) => (
  <MediaObjectFetcher type="Movie" uid={uid}>
    {(movie: Movie) => (
      <>
        {children({
          title: getTitleByOrderForGraphQLObject(movie, ["short", "medium"]),
          image: getGraphQLImageSrc(movie?.images, ImageType.Thumbnail),
          uid: movie.uid,
          href: `/movie/${movie.uid}`,
          releaseDate: (movie.release_date as string | undefined) || "",
          duration: "1hr 38m",
        })}
      </>
    )}
  </MediaObjectFetcher>
);

const Movies: NextPage = () => {
  const [genre, setGenre] = useState<Genre | null>(null);
  const { genres, isError: isGenreError } = useGenreListing();
  const unfilteredMovies = useMovieListing(!!genre);
  const filteredMoviesByGenre = useMovieListingFromGenre(genre?.uid);
  const {
    movies,
    isError: isMovieError,
    isLoading,
  } = genre ? filteredMoviesByGenre : unfilteredMovies;

  const { t } = useTranslation("common");

  if (isMovieError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching movies`}</p>
        <p>{isMovieError.message}</p>
      </div>
    );
  }

  return (
    <>
      <NextSeo title={t("movies")} />
      <MoviesPage
        MovieDataFetcher={MovieDataFetcher}
        genres={genres
          ?.map((g) => g?.name || "")
          .sort(sortArrayIntoAlphabeticalOrder)}
        loading={isLoading}
        movies={
          movies?.map((movie) => ({
            self: "",
            slug: "",
            uid: movie?.uid || "",
          })) || []
        }
        onGenreChange={(name) =>
          setGenre(
            genres?.find(({ name: genreName }) => genreName === name) || null
          )
        }
      />
      {isGenreError && (
        <div className="flex flex-col items-center justify-center text-white">
          <p>{`Error fetching genres: ${isGenreError.message || ""}`}</p>
        </div>
      )}
    </>
  );
};

export default Movies;
